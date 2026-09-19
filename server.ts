import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { WebSocketServer, WebSocket } from "ws";
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();

// Detect Railway environment
const isRailway = Boolean(
  process.env.RAILWAY_ENVIRONMENT ||
  process.env.RAILWAY_ENVIRONMENT_NAME ||
  process.env.RAILWAY_ENVIRONMENT_ID ||
  process.env.RAILWAY_PROJECT_ID ||
  process.env.RAILWAY_SERVICE_ID ||
  process.env.RAILWAY_PUBLIC_DOMAIN ||
  process.env.RAILWAY_STATIC_URL
);

// In production/Railway, listen on process.env.PORT (or 3000 by default)
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL || 'https://pviwktddsltnjjnokrwc.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_PbxicU-umhZOO4PRhSGnHQ_qztBo_UW'; // Using anon/publishable key provided
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(express.json());

// Enable CORS for custom domains and Netlify frontend
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

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

// Helper to send email via Resend with verified domain
async function sendResendEmail({
  to,
  subject,
  html,
  replyTo
}: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.log("----------------- EMAIL PREVIEW (NO RESEND_API_KEY) -----------------");
    console.log(`To: ${Array.isArray(to) ? to.join(", ") : to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Content:\n${html.replace(/<[^>]*>/g, " ").substring(0, 300)}...`);
    console.log("--------------------------------------------------------------------");
    return { success: true, simulated: true };
  }

  // Use the verified domain vulalesedipowersolutions.co.za
  const fromAddress = "Vula Lesedi Solar <notifications@vulalesedipowersolutions.co.za>";

  const payload: any = {
    from: fromAddress,
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
  };

  if (replyTo) {
    payload.reply_to = replyTo;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${resendKey}`
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json() as any;
  if (!response.ok) {
    console.error("Resend API rejected request:", data);
    throw new Error(data.message || data.error || "Failed to send email via Resend API");
  }

  console.log(`Resend email dispatched successfully [ID: ${data.id}] to ${Array.isArray(to) ? to.join(", ") : to}`);
  return { success: true, data };
}

// Helper to notify both client and admin upon lead capture
async function notifyNewLeadCaptured(lead: {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  system_interest?: string;
  message?: string;
  source?: string;
}) {
  const adminEmail = "lesedisolarandbackup@gmail.com";
  const userEmail = lead.email ? lead.email.trim() : null;
  const leadName = lead.name || "Valued Client";
  const leadSource = lead.source || "Thandi (Virtual Receptionist)";

  console.log(`Processing lead notifications for: ${leadName} (${userEmail || 'No email'}) from ${leadSource}`);

  // 1. Send notification to Vula Lesedi Admin Team
  try {
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
        <div style="background: #0a2240; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
          <h2 style="color: #ffffff; margin: 0; font-size: 20px;">⚡ New Solar & Backup Lead Captured</h2>
          <p style="color: #94a3b8; margin: 4px 0 0 0; font-size: 13px;">Captured via ${leadSource}</p>
        </div>
        <div style="padding: 24px 16px;">
          <p style="font-size: 15px; color: #334155; margin-bottom: 20px;">A new customer has requested a solar assessment or consultation:</p>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #1e293b;">
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-weight: bold; width: 140px; color: #64748b;">Client Name:</td>
              <td style="padding: 10px 0; font-weight: 600;">${lead.name || "Not provided"}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-weight: bold; color: #64748b;">Phone Number:</td>
              <td style="padding: 10px 0;"><a href="tel:${lead.phone}" style="color: #16a34a; font-weight: bold; text-decoration: none;">${lead.phone || "Not provided"}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-weight: bold; color: #64748b;">Email Address:</td>
              <td style="padding: 10px 0;">${lead.email ? `<a href="mailto:${lead.email}" style="color: #0284c7; text-decoration: none;">${lead.email}</a>` : "Not provided"}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-weight: bold; color: #64748b;">Location / Area:</td>
              <td style="padding: 10px 0;">${lead.location || "Gauteng"}</td>
            </tr>
            ${lead.system_interest ? `
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-weight: bold; color: #64748b;">System Interest:</td>
              <td style="padding: 10px 0; color: #16a34a; font-weight: bold;">${lead.system_interest}</td>
            </tr>` : ""}
            ${lead.message ? `
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #64748b; vertical-align: top;">Notes / Message:</td>
              <td style="padding: 10px 0; color: #475569;">${lead.message}</td>
            </tr>` : ""}
          </table>
          <div style="margin-top: 24px; padding: 16px; background: #f8fafc; border-radius: 8px; text-align: center;">
            <p style="margin: 0; font-size: 13px; color: #64748b;">This inquiry is already recorded in your Admin CRM Dashboard.</p>
          </div>
        </div>
      </div>
    `;

    await sendResendEmail({
      to: adminEmail,
      subject: `⚡ New Lead: ${leadName} - ${lead.location || "Gauteng"} (${leadSource})`,
      html: adminHtml,
      replyTo: userEmail || undefined
    });
  } catch (err: any) {
    console.error("Failed to send admin notification email:", err.message || err);
  }

  // 2. Send instant confirmation email to the user if an email was provided
  if (userEmail && userEmail.includes("@")) {
    try {
      const userHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
          <div style="background: #0a2240; padding: 24px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: bold;">Vula Lesedi Power Solutions</h1>
            <p style="color: #38bdf8; margin: 6px 0 0 0; font-size: 14px; font-weight: 600;">Powering Your Home & Business With Reliable Solar</p>
          </div>
          <div style="padding: 24px 16px; line-height: 1.6; color: #334155;">
            <p style="font-size: 16px; font-weight: bold; color: #0f172a;">Sanibona, ${leadName}!</p>
            <p style="font-size: 14px;">
              Thank you for reaching out to <strong>Vula Lesedi Power Solutions</strong>. We have successfully received your inquiry for a solar and backup power solution.
            </p>
            <div style="background: #f0fdf4; border-left: 4px solid #16a34a; padding: 16px; border-radius: 4px; margin: 20px 0;">
              <h3 style="color: #166534; margin: 0 0 8px 0; font-size: 15px;">Your Inquiry Details:</h3>
              <p style="margin: 4px 0; font-size: 14px;"><strong>Contact Number:</strong> ${lead.phone || "Provided"}</p>
              <p style="margin: 4px 0; font-size: 14px;"><strong>Area:</strong> ${lead.location || "Gauteng"}</p>
              ${lead.system_interest ? `<p style="margin: 4px 0; font-size: 14px;"><strong>Package / Requirement:</strong> ${lead.system_interest}</p>` : ""}
            </div>
            <p style="font-size: 14px;">
              Our senior solar technical team is currently reviewing your energy requirements. One of our advisors will contact you shortly via phone or WhatsApp to provide your customized proposal and answer any technical questions.
            </p>
            <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 13px; color: #64748b;">
              <p style="margin: 0 0 4px 0;"><strong>Vula Lesedi Power Solutions</strong></p>
              <p style="margin: 0 0 4px 0;">📍 Serving Greater Gauteng (Johannesburg, Pretoria, Midrand & surrounding areas)</p>
              <p style="margin: 0 0 4px 0;">📞 Phone / WhatsApp: <a href="tel:+27827878846" style="color: #16a34a; font-weight: bold; text-decoration: none;">082 787 8846</a></p>
              <p style="margin: 0;">✉️ Email: <a href="mailto:lesedisolarandbackup@gmail.com" style="color: #0284c7; text-decoration: none;">lesedisolarandbackup@gmail.com</a></p>
            </div>
          </div>
        </div>
      `;

      await sendResendEmail({
        to: userEmail,
        subject: "Thank You for Contacting Vula Lesedi Power Solutions",
        html: userHtml,
        replyTo: "lesedisolarandbackup@gmail.com"
      });
    } catch (err: any) {
      console.error("Failed to send client confirmation email:", err.message || err);
    }
  }
}

// API route to send custom emails via Resend (e.g., quotes from Admin Dashboard)
app.post("/api/send-email", async (req, res) => {
  const { to, subject, html, replyTo } = req.body;
  if (!to || !subject || !html) {
    return res.status(400).json({ error: "Missing required fields: to, subject, html" });
  }

  try {
    const result = await sendResendEmail({ to, subject, html, replyTo });
    res.json(result);
  } catch (err: any) {
    console.error("Resend API Error in /api/send-email:", err);
    res.status(500).json({ error: err.message || "Internal server error sending email" });
  }
});

// Dedicated API route for submitting a new lead and triggering notification emails
app.post("/api/leads", async (req, res) => {
  const { name, phone, email, location, system_interest, message, source } = req.body;
  
  const leadRecord = {
    name: (name || "").trim(),
    phone: (phone || "").trim(),
    email: (email || "").trim(),
    location: (location || "").trim(),
    system_interest: system_interest || "",
    message: (message || "").trim(),
    status: "New",
    created_at: new Date().toISOString()
  };

  // 1. Insert into Supabase
  try {
    const { error: dbError } = await supabase.from('leads').insert([leadRecord]);
    if (dbError) {
      console.error("Supabase insert error in /api/leads:", dbError);
    } else {
      console.log("Lead inserted into Supabase via /api/leads");
    }
  } catch (dbErr) {
    console.warn("Supabase insert exception:", dbErr);
  }

  // 2. Trigger emails to both User and Admin
  try {
    await notifyNewLeadCaptured({
      ...leadRecord,
      source: source || "Website Contact Form"
    });
  } catch (emailErr) {
    console.error("Error triggering lead emails:", emailErr);
  }

  res.json({ success: true, message: "Lead recorded and notifications dispatched." });
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

  const wss = new WebSocketServer({ noServer: true });

  const setupUpgrade = (srv: any) => {
    srv.on("upgrade", (request: any, socket: any, head: any) => {
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
  };

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Vula Lesedi Server running on http://0.0.0.0:${PORT}`);
  });
  server.on("error", (err: any) => {
    console.error(`[SERVER ERROR] Failed to bind to port ${PORT}:`, err);
  });
  setupUpgrade(server);

  // If Railway or environment set a PORT other than 3000, also bind 3000 for Railway Target Port 3000
  if (PORT !== 3000) {
    try {
      const server3000 = app.listen(3000, "0.0.0.0", () => {
        console.log("Vula Lesedi Server also listening on custom target port 3000");
      });
      server3000.on("error", (e: any) => {
        console.log("Port 3000 optional listener status:", e.code || e.message);
      });
      setupUpgrade(server3000);
    } catch (err) {
      console.warn("Could not bind optional port 3000:", err);
    }
  }

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
                const leadData = {
                  ...lead,
                  status: "New",
                  created_at: new Date().toISOString()
                };

                supabase.from('leads').insert([leadData]).then(({ error }) => {
                  if (error) {
                    console.error("Supabase insert error:", error);
                  } else {
                    console.log("Lead saved to Supabase successfully.");
                  }
                });

                // Trigger email notification to user & admin via Resend
                notifyNewLeadCaptured({
                  ...lead,
                  source: "Thandi (Virtual Receptionist Call)"
                }).catch((emailErr) => {
                  console.error("Error triggering voice lead email notification:", emailErr);
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
