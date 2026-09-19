# Vula Lesedi Solar — AI Voice Agent & Chatbot Architecture Guide

This document is a complete architectural specification and technical walkthrough of how the real-time AI Voice Receptionist ("Thandi") and interactive chat system were built for **Vula Lesedi Power Solutions**. It is designed for engineers and AI assistants (such as Claude) to understand, reproduce, modify, or extend the system.

---

## 1. High-Level System Architecture

The AI agent operates as a **full-duplex, multimodal, real-time voice and text conversational assistant**. It functions both as an AI voice phone receptionist and as an interactive chatbot fallback.

```
+------------------------------------------------------------------------------------+
|                                    CLIENT (BROWSER)                                 |
|                                                                                    |
|  +--------------------+        +-----------------------+        +---------------+  |
|  | Microphone Capture |        |  Web Audio Playback   |        |  Chat UI &    |  |
|  | (16kHz PCM Float32 |        |  (24kHz PCM Gapless   |        |  Lead Confirm |  |
|  |  -> Int16 Base64)  |        |   Audio Scheduler)    |        |  Modal Dialog |  |
|  +---------+----------+        +-----------^-----------+        +-------^-------+  |
+------------|-------------------------------|----------------------------|----------+
             | Binary Audio Frames           | 24kHz PCM Audio            | Tool Calls &
             | (JSON: { audio: ... })        | + Transcripts              | Tool Responses
             v                               |                            v
+------------------------------------------------------------------------------------+
|                         NODE.JS / EXPRESS GATEWAY (server.ts)                       |
|                                                                                    |
|  * HTTP /api/voice-status (Diagnostics & health check)                             |
|  * WebSocket Server on route /live                                                 |
|  * Bi-directional proxy between browser and Gemini Multimodal Live API             |
|  * Tool execution handler (Supabase Lead persistence)                              |
+----------------------------+-------------------------------------------------------+
                             | Google GenAI Live Protocol
                             | (gemini-3.1-flash-live-preview)
                             v
+------------------------------------------------------------------------------------+
|                        GOOGLE GEMINI MULTIMODAL LIVE API                           |
|                                                                                    |
|  * Native audio-to-audio understanding and synthesis                               |
|  * South African persona ("Thandi") with domain knowledge                          |
|  * Native interruption detection (Barge-in)                                        |
|  * Function calling (verify_lead_details tool)                                     |
|  * Deterministic call termination via [END_CALL] tag                               |
+------------------------------------------------------------------------------------+
```

---

## 2. Core Technologies & Dependencies

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Foundation Model** | `gemini-3.1-flash-live-preview` | Low-latency audio-in / audio-out multimodal model via Gemini Live API |
| **SDK** | `@google/genai` | Official Google GenAI TypeScript SDK |
| **Backend Runtime** | Node.js + Express (`server.ts`) | Reverse proxy, static file server, and WebSocket gateway |
| **WebSocket Engine** | `ws` (`WebSocketServer`) | Manages real-time binary audio streams over HTTP upgrade `/live` |
| **Frontend Framework**| React 18 + TypeScript + Vite | User interface, state management, modal dialogs |
| **Audio Processing** | Web Audio API (`AudioContext`, `ScriptProcessorNode`) | Microphone recording, downsampling, and gapless playback |
| **Database** | Supabase (`@supabase/supabase-js`) | Automated persistence of confirmed customer leads |
| **Animations & Icons**| `motion/react` + `lucide-react` | Sound wave visualizer, spring-animated call dialogs, icons |

---

## 3. Backend Gateway Implementation (`server.ts`)

The backend establishes an Express server that hosts both the frontend static build and the WebSocket upgrade handler for live voice connections.

### 3.1 HTTP Upgrade & WebSocket Endpoint
```typescript
// server.ts
const wss = new WebSocketServer({ noServer: true });

server.on("upgrade", (request, socket, head) => {
  const rawUrl = request.url || "";
  const pathname = rawUrl.split("?")[0].replace(/\/$/, "");
  if (pathname === "/live") {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  } else {
    socket.destroy();
  }
});
```

### 3.2 Gemini Multimodal Live API Session
When a browser client connects to `/live`, the server:
1. Extracts voice preferences from query parameters (defaulting to `"Aoede"`).
2. Establishes a real-time live session with `ai.live.connect`.
3. Sets `responseModalities: [Modality.AUDIO]` for native speech generation.
4. Enables both `inputAudioTranscription: {}` and `outputAudioTranscription: {}` so transcripts can be rendered on screen.

```typescript
const session = await ai.live.connect({
  model: "gemini-3.1-flash-live-preview",
  config: {
    responseModalities: [Modality.AUDIO],
    speechConfig: {
      voiceConfig: {
        prebuiltVoiceConfig: {
          voiceName: selectedVoice // e.g. Aoede (Thandi), Kore, Puck, Charon
        }
      }
    },
    systemInstruction: SYSTEM_INSTRUCTION,
    outputAudioTranscription: {},
    inputAudioTranscription: {},
    tools: [{
      functionDeclarations: [{
        name: "verify_lead_details",
        description: "Trigger a UI verification screen for the caller to confirm their lead details...",
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
    onmessage: (message) => { /* Process model audio, tool calls, transcripts, and interruptions */ },
    onerror: (err) => { /* Handle disconnects gracefully */ },
    onclose: () => { /* Clean up active live session */ }
  }
});
```

### 3.3 Prompt Engineering & Persona Definition
The system instruction guides the model to act as a natural voice receptionist:
* **Identity:** "Thandi", virtual receptionist for Vula Lesedi Power Solutions.
* **Tone & Vocabulary:** Warm, professional, using South African phrasing (e.g., *"Sanibona!"*, *"load shedding"*, *"solar backup"*).
* **Voice Constraints:** Avoid markdown, bullet points, asterisks, or emojis in spoken output; use clean conversational sentences.
* **Barge-in Support:** Instructs the model to yield gracefully when interrupted.
* **Deterministic Termination:** When the customer indicates they are done or says goodbye, the model appends `[END_CALL]`. The server detects this token, strips it from the transcript, and sends `{ endCall: true }` to the client to hang up the phone.

### 3.4 Tool Calling & Supabase Lead Capture
When the caller expresses interest in a quote or site assessment and provides their contact details:
1. Gemini issues a tool call: `verify_lead_details(name, phone, email, location)`.
2. The server intercepts `message.toolCall` and forwards it to the browser via WebSocket:
   ```json
   {
     "toolCall": {
       "id": "call_123",
       "name": "verify_lead_details",
       "args": { "name": "John Doe", "phone": "0821234567", "email": "john@example.com", "location": "Sandton" }
     }
   }
   ```
3. The browser displays a confirmation modal where the user can verify or edit their details.
4. When the user confirms, the browser sends back:
   ```json
   {
     "toolResponse": {
       "id": "call_123",
       "name": "verify_lead_details",
       "result": "confirmed",
       "lead": { ... }
     }
   }
   ```
5. The server writes the lead into the Supabase database:
   ```typescript
   supabase.from('leads').insert([lead]);
   ```
6. The server resolves the function call back to Gemini:
   ```typescript
   session.sendToolResponse({
     functionResponses: [{
       id: id,
       name: name,
       response: { status: "success", message: "User confirmed their details and lead was saved." }
     }]
   });
   ```

---

## 4. Frontend Audio Architecture (`VoiceReceptionist.tsx`)

Audio in browsers requires precise handling to prevent echo, latency, clipping, and out-of-order playback.

### 4.1 Audio Ingestion & Conversion Pipeline (Microphone -> Server)
Gemini Multimodal Live API expects 16,000 Hz, 1-channel (mono), 16-bit linear PCM audio.

```
[User Mic] 
   --> navigator.mediaDevices.getUserMedia (echoCancellation, noiseSuppression, sampleRate: 16000)
   --> AudioContext (16000 Hz)
   --> ScriptProcessorNode (bufferSize: 4096)
   --> Float32Array [-1.0 to +1.0]
   --> pcmToBase64() [Maps to 16-bit signed integer -32768 to 32767, little-endian]
   --> WebSocket.send({ audio: base64Chunk })
```

#### PCM Encoding Helper
```typescript
function pcmToBase64(pcmData: Float32Array): string {
  const pcm16 = new Int16Array(pcmData.length);
  for (let i = 0; i < pcmData.length; i++) {
    let s = Math.max(-1, Math.min(1, pcmData[i]));
    s = s < 0 ? s * 0x8000 : s * 0x7FFF;
    pcm16[i] = s;
  }
  const buffer = new ArrayBuffer(pcm16.length * 2);
  const view = new DataView(buffer);
  for (let i = 0; i < pcm16.length; i++) {
    view.setInt16(i * 2, pcm16[i], true); // Little-endian format
  }
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
```

### 4.2 Gapless Audio Scheduling Pipeline (Server -> Speaker)
Gemini outputs raw 24,000 Hz PCM audio chunks in base64. Because network packets arrive in small, irregular bursts, queuing them directly to immediate playback causes jitter and pops. Instead, we use an **AudioContext schedule timeline (`nextStartTimeRef`)**:

```typescript
const playAudioChunk = (audioCtx: AudioContext, base64: string) => {
  const pcm = base64ToPcm(base64);
  const buffer = audioCtx.createBuffer(1, pcm.length, audioCtx.sampleRate);
  buffer.getChannelData(0).set(pcm);

  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
  source.connect(audioCtx.destination);

  // Synchronize audio clock
  const currentTime = audioCtx.currentTime;
  if (nextStartTimeRef.current < currentTime) {
    nextStartTimeRef.current = currentTime;
  }

  source.start(nextStartTimeRef.current);
  activeSourcesRef.current.push(source);
  nextStartTimeRef.current += buffer.duration;

  source.onended = () => {
    activeSourcesRef.current = activeSourcesRef.current.filter((src) => src !== source);
  };
};
```

### 4.3 Barge-In / Interruption Handling
When the caller speaks while the AI is talking:
1. Gemini automatically detects the user's voice stream.
2. The model sends an `interrupted: true` signal over the WebSocket.
3. The frontend immediately stops all currently queued and playing `AudioBufferSourceNode` objects:
   ```typescript
   if (msg.interrupted) {
     activeSourcesRef.current.forEach((source) => {
       try { source.stop(); } catch (e) {}
     });
     activeSourcesRef.current = [];
     nextStartTimeRef.current = 0; // Reset scheduling cursor
     setTranscriptLog((prev) => [...prev, { sender: "ai", text: "[Interrupted]" }]);
   }
   ```
4. The AI immediately yields and begins processing the user's interruption.

---

## 5. Dual-Mode Fallback: Integrated Chatbot

If microphone permissions are denied by the browser, if hardware is unavailable, or if the user clicks **"Use Keyboard"**, the interface transitions into a live text chat:

1. **Microphone is bypassed or muted.**
2. A text input bar appears at the bottom of the call screen.
3. When the user sends a message, it is transmitted over the active WebSocket:
   ```json
   { "textInput": "What size solar system do I need for a 3-bedroom house?" }
   ```
4. The backend injects this text directly into the live Gemini session:
   ```typescript
   session.sendClientContent({
     turns: [{ role: "user", parts: [{ text: parsed.textInput }] }],
     turnComplete: true
   });
   ```
5. Gemini responds both with spoken audio (which the user can hear) and streaming text transcription (which appears in the chat transcript window).

---

## 6. CRM Call Logging & Transcript History

When a call concludes (via user hanging up or the model triggering `[END_CALL]`):
1. The client captures the total duration, timestamp, verified caller details, and full conversation transcript.
2. The call record is stored in `localStorage` under `vula_lesedi_calls`.
3. A `storage` event is dispatched across the browser window.
4. The **Admin Dashboard** (`src/components/AdminDashboard.tsx`) consumes this log, displaying caller records, call lengths, audio statuses, and full chat/voice transcript replays for lead audits.

---

## 7. Diagnostics & Environment Setup

### Environment Variables
* `GEMINI_API_KEY`: Google AI Studio API key with access to Gemini 2.0 / 3.0 Multimodal Live API.
* `SUPABASE_URL`: Supabase project URL.
* `SUPABASE_ANON_KEY`: Supabase anon/public API key for client-side and backend lead creation.
* `PORT`: Service port (defaults to `3000` for container ingress compatibility).

### Health Diagnostic Endpoint
Visiting `/api/voice-status` returns the gateway health status:
```json
{
  "status": "ok",
  "voiceReady": true,
  "hasGeminiKey": true,
  "model": "gemini-3.1-flash-live-preview",
  "environment": "railway",
  "hint": "Voice gateway backend is ready"
}
```

---

## 8. Summary Checklist for Replicating this Agent

1. **Backend:**
   - Mount a WebSocket server on `/live`.
   - Initialize `@google/genai` with `ai.live.connect`.
   - Stream raw audio frames from client to `session.sendRealtimeInput`.
   - Listen for `modelTurn.parts` audio and forward to the client.
   - Listen for `toolCall` and `interrupted` events.
2. **Frontend:**
   - Capture microphone at 16kHz mono, convert Float32 to Int16 Base64.
   - Decode incoming audio to Float32 and schedule via `AudioContext.currentTime`.
   - Handle interruptions by stopping all playing source nodes.
   - Provide a confirmation modal for tool executions.
   - Provide a keyboard input fallback for typing.
