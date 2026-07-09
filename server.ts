import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { WebSocketServer, WebSocket } from "ws";
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL || 'https://pviwktddsltnjjnokrwc.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_PbxicU-umhZOO4PRhSGnHQ_qztBo_UW'; // Using anon/publishable key provided
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(express.json());

// API route for health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
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
      const url = new URL(request.url || "", `http://${request.headers.host || "localhost"}`);
      if (url.pathname === "/live") {
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
    const urlParams = new URL(request.url || "", `http://${request.headers.host || "localhost"}`).searchParams;
    const selectedVoice = urlParams.get("voice") || "Aoede";

    let session: any = null;

    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY environment variable is not defined");
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
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(JSON.stringify({ error: "Voice connection failed: " + err.message }));
      }
      clientWs.close();
    }
  });
}

startServer().catch((err) => {
  console.error("[CRITICAL] Server failed to start:", err);
});
