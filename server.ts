import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { WebSocketServer, WebSocket } from "ws";
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
// AI Studio requires binding to 3000 locally.
// If deployed in production on Railway, Railway sets RAILWAY_ENVIRONMENT / RAILWAY_PROJECT_ID and injects PORT.
const isRailway = Boolean(
  process.env.RAILWAY_ENVIRONMENT ||
  process.env.RAILWAY_ENVIRONMENT_NAME ||
  process.env.RAILWAY_ENVIRONMENT_ID ||
  process.env.RAILWAY_PROJECT_ID ||
  process.env.RAILWAY_SERVICE_ID ||
  process.env.RAILWAY_PUBLIC_DOMAIN ||
  process.env.RAILWAY_STATIC_URL
);
const PORT = (isRailway || process.env.NODE_ENV === "production") && process.env.PORT
  ? parseInt(process.env.PORT, 10)
  : 3000;

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL || 'https://pviwktddsltnjjnokrwc.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_PbxicU-umhZOO4PRhSGnHQ_qztBo_UW'; // Using anon/publishable key provided
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(express.json());

// API route for health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// API route for voice gateway diagnostics and readiness
app.get("/api/voice-status", (req, res) => {
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
  res.json({
    status: "ok",
    voiceReady: hasGeminiKey,
    hasGeminiKey,
    model: "gemini-3.1-flash-live-preview",
    environment: isRailway ? "railway" : "default",
    hint: hasGeminiKey
      ? "Voice gateway backend is ready"
      : "GEMINI_API_KEY is missing in server environment variables. Please add GEMINI_API_KEY in your Railway project Variables."
  });
});

// API route to send emails via Resend
app.post("/api/send-email", async (req, res) => {
  const { to, subject, html } = req.body;
  if (!to || !subject || !html) {
    return res.status(400).json({ error: "Missing required fields: to, subject, html" });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.log("----------------- EMAIL PREVIEW (RESEND SIMULATOR) -----------------");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Content:\n${html.replace(/<[^>]*>/g, " ").substring(0, 300)}...`);
    console.log("--------------------------------------------------------------------");
    return res.json({ 
      success: true, 
      simulated: true, 
      message: "Resend API Key is not configured. Email preview logged to server terminal successfully." 
    });
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendKey}`
      },
      body: JSON.stringify({
        from: "Vula Lesedi Power <onboarding@resend.dev>",
        to,
        subject,
        html
      })
    });

    const data = await response.json() as any;
    if (!response.ok) {
      throw new Error(data.message || "Failed to send email via Resend API");
    }

    res.json({ success: true, data });
  } catch (err: any) {
    console.error("Resend API Error:", err);
    res.status(500).json({ error: err.message || "Internal server error sending email" });
  }
});

const SYSTEM_INSTRUCTION = `# PERSONA & IDENTITY
- **Name:** Thandi
- **Role:** AI Front Desk Receptionist and Solar Advisor for Vula Lesedi Power Solutions.
- **Tone & Style:** Professional, warm, helpful, and proudly South African. Speak clearly with an inviting, conversational pace suited for real-time voice streams.

# CONVERSATIONAL GOAL & FLOW
Your goal is to assist incoming callers by greeting them, identifying their needs regarding solar installations or electrical services, and seamlessly gathering their booking info.

1. **Greeting & Intake (One-time loop):**
   - Greet the customer warmly: "Sanibona! Thank you for calling Vula Lesedi Power Solutions. This is Thandi, how can we brighten your day today?"
   - Listen to their problem (e.g., load shedding backup, solar panels, electrical faults).
   - Politely gather their full name, contact number, and location (e.g., Johannesburg, Midrand, Randburg).

2. **Core Inquiries (Continuous loop):**
   - Answer basic questions about solar setups, inverter backups, and pricing. 
   - Keep answers brief and conversational. Avoid walls of text because this is a real-time voice call.

3. **Booking Integration & Lead Capture:**
   - When the caller wants a quote, callback, or assessment, you MUST collect their: 1) Full Name, 2) Phone Number, 3) Email, and 4) Location.
   - Once you have all 4 pieces of information, you MUST immediately call the "verify_lead_details" tool. Tell the user: "I'm sending these details to your screen right now, please check and confirm them for me." 
   - Wait for them to confirm on their screen. If the tool returns a success message, let them know their details are saved and someone will contact them shortly.

# REAL-TIME VOICE GUARDRAILS
- **Barge-in Support:** The user can interrupt you at any time. If they speak over you, stop talking immediately and address their interruption gracefully.
- **Formatting:** Do not use bullet points, asterisks, markdown charts, or emojis in your speech generation. Always reply in clean, unbroken prose sentences so the text-to-speech engine sounds natural.
- **Language:** Respond unmistakably in English with standard South African terminology (like "Load shedding" instead of "rolling blackouts").
- **Ending the call:** Once you have finished helping them, or if the user says goodbye, thank you, or indicates they are done, behave like a real human being and ALWAYS append the exact tag [END_CALL] at the very end of your final sentence to terminate the connection.`;

async function startServer() {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      }
    }
  });

  // Serve static files / Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Mounted Vite middleware for development");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static files from /dist");
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Vula Lesedi Server running on http://localhost:${PORT}`);
  });

  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", (request, socket, head) => {
    try {
      const rawUrl = request.url || "";
      const pathname = rawUrl.split("?")[0].replace(/\/$/, "");
      if (pathname === "/live") {
        wss.handleUpgrade(request, socket, head, (ws) => {
          wss.emit("connection", ws, request);
        });
      } else {
        socket.destroy();
      }
    } catch (err) {
      console.error("[WS UPGRADE ERROR]", err);
      socket.destroy();
    }
  });

  wss.on("connection", async (clientWs, request) => {
    console.log("[WS CONNECTED] Client connected to Voice Gateway");
    
    // Extract custom voice preference from query parameters (fallback to "Aoede")
    let selectedVoice = "Aoede";
    try {
      const queryString = (request.url || "").split("?")[1];
      if (queryString) {
        const params = new URLSearchParams(queryString);
        selectedVoice = params.get("voice") || "Aoede";
      }
    } catch (e) {
      selectedVoice = "Aoede";
    }

    let session: any = null;

    try {
      if (!process.env.GEMINI_API_KEY || !process.env.GEMINI_API_KEY.trim()) {
        throw new Error("GEMINI_API_KEY is not set on the server. Please add GEMINI_API_KEY to your Railway project Variables.");
      }

      session = await ai.live.connect({
        model: "gemini-3.1-flash-live-preview",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: selectedVoice
              }
            }
          },
          systemInstruction: SYSTEM_INSTRUCTION,
          outputAudioTranscription: {},
          inputAudioTranscription: {},
          tools: [{
            functionDeclarations: [{
              name: "verify_lead_details",
              description: "Trigger a UI verification screen for the caller to confirm their lead details. Only use this when they want a quote or a booking and have provided their full name, phone number, email, and location.",
              parameters: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  phone: { type: Type.STRING },
                  email: { type: Type.STRING },
                  location: { type: Type.STRING }
                },
                required: ["name", "phone", "email", "location"]
              }
            }]
          }]
        },
        callbacks: {
          onmessage: (message: any) => {
            if (clientWs.readyState !== WebSocket.OPEN) return;

            if (message.toolCall) {
              const call = message.toolCall.functionCalls?.[0];
              if (call && call.name === "verify_lead_details") {
                clientWs.send(JSON.stringify({
                  toolCall: {
                    id: call.id,
                    name: call.name,
                    args: call.args
                  }
                }));
              }
            }

            // 1. Handle user's spoken input transcription
            const inputTranscriptionObj = message.serverContent?.inputTranscription;
            if (inputTranscriptionObj?.text) {
              clientWs.send(
                JSON.stringify({
                  text: inputTranscriptionObj.text.trim(),
                  sender: "user"
                })
              );
            }

            // 2. Handle audio packets and real-time model text
            const modelTurn = message.serverContent?.modelTurn;
            let transcriptText = "";

            if (modelTurn?.parts) {
              for (const part of modelTurn.parts) {
                const audioBase64 = part.inlineData?.data;
                if (audioBase64) {
                  clientWs.send(JSON.stringify({ audio: audioBase64 }));
                }
                if (part.text) {
                  transcriptText += part.text;
                }
              }
            }

            const transcriptionObj = message.serverContent?.outputTranscription;
            if (transcriptionObj?.text) {
              transcriptText += " " + transcriptionObj.text;
            }

            // Clean and send AI text stream to client
            if (transcriptText.trim()) {
              let cleanText = transcriptText;
              if (cleanText.includes("[END_CALL]")) {
                cleanText = cleanText.replace("[END_CALL]", "").trim();
              }
              if (cleanText.trim()) {
                clientWs.send(
                  JSON.stringify({
                    text: cleanText,
                    sender: "ai"
                  })
                );
              }
            }

            // Trigger end call if requested by model instruction
            if (transcriptText.includes("[END_CALL]")) {
              console.log("[WS EVENT] Received end-call trigger. Signal to client.");
              clientWs.send(JSON.stringify({ endCall: true }));
            }

            if (message.serverContent?.interrupted) {
              clientWs.send(JSON.stringify({ interrupted: true }));
            }
          },
          onerror: (geminiErr: any) => {
            console.error("[GEMINI SESSION ERROR]", geminiErr);
            if (clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ error: "Gemini session error: " + (geminiErr.message || "Connection interrupted") }));
            }
          },
          onclose: (closeInfo: any) => {
            console.log("[GEMINI SESSION CLOSED]", closeInfo);
            if (clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ endCall: true }));
              clientWs.close();
            }
          }
        }
      });

      clientWs.on("message", (data) => {
        try {
          const parsed = JSON.parse(data.toString());

          // Send initial greeting trigger
          if (parsed.initGreeting) {
            session.sendClientContent({
              turns: [{
                role: "user",
                parts: [{ text: "Hello! Please immediately welcome me, introduce yourself as Thandi, the virtual receptionist for Vula Lesedi Power Solutions, and ask how you can help me today with our solar and backup power installations." }]
              }],
              turnComplete: true
            });
            return;
          }

          // Support fallback typed messages if microphone is blocked
          if (parsed.textInput) {
            session.sendClientContent({
              turns: [{ role: "user", parts: [{ text: parsed.textInput }] }],
              turnComplete: true
            });
            return;
          }

          // Handle tool response from the client (e.g., lead verification confirmation)
          if (parsed.toolResponse) {
            const { id, name, result, lead } = parsed.toolResponse;
            if (name === "verify_lead_details") {
              if (result === "confirmed") {
                // Save to Supabase
                supabase.from('leads').insert([lead]).then(({ error }) => {
                  if (error) {
                    console.error("Supabase insert error:", error);
                  } else {
                    console.log("Lead saved to Supabase successfully.");
                  }
                });
                
                // Tell Gemini the tool was successful
                session.sendToolResponse({
                  functionResponses: [{
                    id: id,
                    name: name,
                    response: { status: "success", message: "User confirmed their details and lead was saved." }
                  }]
                });
              } else {
                // Tell Gemini the user cancelled or rejected the details
                session.sendToolResponse({
                  functionResponses: [{
                    id: id,
                    name: name,
                    response: { status: "cancelled", message: "User cancelled or rejected the details. Ask them for the correct details." }
                  }]
                });
              }
            }
            return;
          }

          // Send binary mic inputs directly to Gemini
          if (parsed.audio) {
            session.sendRealtimeInput({
              audio: {
                data: parsed.audio,
                mimeType: "audio/pcm;rate=16000"
              }
            });
          }
        } catch (err) {
          console.error("Error piping audio payload to Gemini:", err);
        }
      });

      clientWs.on("close", () => {
        console.log("[WS CLOSED] Client closed connection, shutting down Gemini Live session...");
        if (session) {
          try {
            session.close();
          } catch (e) {
            console.error("Error closing live session:", e);
          }
        }
      });

    } catch (err: any) {
      console.error("[GEMINI CONNECT FAILED]", err);
      const errMsg = err?.message || "Failed to establish voice session with Gemini Live";
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(JSON.stringify({ error: errMsg }));
      }
      setTimeout(() => {
        try {
          if (clientWs.readyState === WebSocket.OPEN || clientWs.readyState === WebSocket.CONNECTING) {
            clientWs.close(1011, errMsg.slice(0, 100));
          }
        } catch (e) {}
      }, 400);
    }
  });
}

startServer().catch((err) => {
  console.error("[CRITICAL] Server failed to start:", err);
});
