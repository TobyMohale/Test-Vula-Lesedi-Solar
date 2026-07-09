import React, { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Loader2, X, Send, Volume2, Info, Phone, PhoneCall, PhoneOff } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// HELPER: Convert Float32 audio buffer to standard 16-bit Int Base64
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
    view.setInt16(i * 2, pcm16[i], true); // little-endian
  }
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// HELPER: Convert 16-bit Int Base64 audio buffer back to Float32 array
function base64ToPcm(base64: string): Float32Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const buffer = bytes.buffer;
  const view = new DataView(buffer);
  const pcm16 = new Int16Array(buffer.byteLength / 2);
  for (let i = 0; i < pcm16.length; i++) {
    pcm16[i] = view.getInt16(i * 2, true);
  }
  const pcm32 = new Float32Array(pcm16.length);
  for (let i = 0; i < pcm16.length; i++) {
    pcm32[i] = pcm16[i] / (pcm16[i] < 0 ? 0x8000 : 0x7FFF);
  }
  return pcm32;
}

export default function VoiceReceptionist() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMicAvailable, setIsMicAvailable] = useState(true);
  const [inputText, setInputText] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("Aoede");
  const [transcriptLog, setTranscriptLog] = useState<{ sender: "ai" | "user"; text: string }[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [leadVerification, setLeadVerification] = useState<{ id: string, name: string, args: any } | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const isMutedRef = useRef(false);
  const timerIntervalRef = useRef<any>(null);

  // Sync isMutedRef with state to prevent stale closures in the audio handler
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // Call timer logic
  useEffect(() => {
    if (isConnected) {
      setCallDuration(0);
      timerIntervalRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      setCallDuration(0);
    }
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isConnected]);

  // Format call duration to MM:SS
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Connect to live receptionist WebSocket
  const connect = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      setIsMicAvailable(true);
      setTranscriptLog([
        { sender: "ai", text: "Connecting to Vula Lesedi Voice Gateway..." }
      ]);
      nextStartTimeRef.current = 0;
      activeSourcesRef.current = [];

      // Determine correct WS protocol based on page environment
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/live?voice=${selectedVoice}`;
      
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      // CRITICAL: Unlocking output AudioContext on user action
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      const outputAudioCtx = new AudioCtxClass({ sampleRate: 24000 });
      outputAudioCtxRef.current = outputAudioCtx;

      // Unmute/warmup output context immediately
      const silentBuf = outputAudioCtx.createBuffer(1, 1, 24000);
      const silentSrc = outputAudioCtx.createBufferSource();
      silentSrc.buffer = silentBuf;
      silentSrc.connect(outputAudioCtx.destination);
      silentSrc.start(0);

      ws.onopen = () => {
        setIsConnected(true);
        setIsConnecting(false);
        setTranscriptLog([
          { sender: "ai", text: "Call connected. Welcome!" }
        ]);
        ws.send(JSON.stringify({ initGreeting: true }));
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          
          if (msg.error) {
            setError(msg.error);
            disconnect();
            return;
          }

          if (msg.toolCall) {
            setLeadVerification(msg.toolCall);
          }

          if (msg.interrupted) {
            // Cancel current playback and clear future schedule when user speaks over the AI
            activeSourcesRef.current.forEach((source) => {
              try {
                source.stop();
              } catch (e) {}
            });
            activeSourcesRef.current = [];
            nextStartTimeRef.current = 0;
            setTranscriptLog((prev) => [
              ...prev,
              { sender: "ai", text: "[Interrupted]" }
            ]);
          }

          if (msg.audio) {
            playAudioChunk(outputAudioCtx, msg.audio);
          }

          if (msg.text) {
            setTranscriptLog((prev) => {
              if (prev.length === 0) {
                return [{ sender: msg.sender, text: msg.text }];
              }
              const last = prev[prev.length - 1];
              if (last.sender === msg.sender) {
                if (msg.sender === "ai") {
                  if (
                    last.text === "Connecting to Vula Lesedi Voice Gateway..." ||
                    last.text === "Call connected. Welcome!" ||
                    last.text === "[Interrupted]"
                  ) {
                    return [...prev, { sender: "ai", text: msg.text }];
                  }
                  // Append chunks for streaming AI text
                  if (!last.text.includes(msg.text)) {
                    return [
                      ...prev.slice(0, -1),
                      { sender: "ai", text: last.text + msg.text }
                    ];
                  }
                  return prev;
                } else {
                  // For user speech transcription updates
                  return [
                    ...prev.slice(0, -1),
                    { sender: "user", text: msg.text }
                  ];
                }
              } else {
                return [...prev, { sender: msg.sender, text: msg.text }];
              }
            });
          }

          if (msg.endCall) {
            setTranscriptLog((prev) => [
              ...prev,
              { sender: "ai", text: "Thank you for calling Vula Lesedi Power Solutions. Hanging up..." }
            ]);
            setTimeout(() => {
              disconnect();
            }, 2500);
          }
        } catch (parseErr) {
          console.error("Error parsing WebSocket packet:", parseErr);
        }
      };

      ws.onclose = () => {
        disconnect();
      };

      ws.onerror = () => {
        setError("Network error occurred with voice session.");
        disconnect();
      };

      // Set up microphone and 16kHz PCM downsampling
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            channelCount: 1,
            sampleRate: 16000
          }
        });
        streamRef.current = stream;

        const inputAudioCtx = new AudioCtxClass({ sampleRate: 16000 });
        inputAudioCtxRef.current = inputAudioCtx;

        const sourceNode = inputAudioCtx.createMediaStreamSource(stream);
        // Using ScriptProcessor for high compliance across browsers
        const processorNode = inputAudioCtx.createScriptProcessor(4096, 1, 1);
        processorRef.current = processorNode;

        sourceNode.connect(processorNode);
        processorNode.connect(inputAudioCtx.destination);

        processorNode.onaudioprocess = (e) => {
          if (ws.readyState === WebSocket.OPEN && !isMutedRef.current) {
            const rawFloatData = e.inputBuffer.getChannelData(0);
            const base64Chunk = pcmToBase64(rawFloatData);
            ws.send(JSON.stringify({ audio: base64Chunk }));
          }
        };
      } catch (micErr) {
        console.warn("Microphone access blocked or unavailable. Falling back to type-to-reply.");
        setIsMicAvailable(false);
        setError("Microphone blocked. Switched to 'Listening + Type-to-Reply' mode!");
      }

    } catch (err: any) {
      console.error("Connection initiation failed:", err);
      setError("Failed to initialize connection.");
      disconnect();
    }
  };

  // Play audio chunks with gapless scheduling
  const playAudioChunk = (audioCtx: AudioContext, base64: string) => {
    try {
      const pcm = base64ToPcm(base64);
      const buffer = audioCtx.createBuffer(1, pcm.length, audioCtx.sampleRate);
      buffer.getChannelData(0).set(pcm);

      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtx.destination);

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
    } catch (audioErr) {
      console.error("Failed to play audio frame:", audioErr);
    }
  };

  const disconnect = () => {
    setIsConnecting(false);
    setIsConnected(false);
    setIsMuted(false);

    activeSourcesRef.current.forEach((src) => {
      try {
        src.stop();
      } catch (e) {}
    });
    activeSourcesRef.current = [];

    if (wsRef.current) {
      const ws = wsRef.current;
      wsRef.current = null;
      ws.onclose = null;
      ws.onerror = null;
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    }
    if (processorRef.current) {
      try {
        processorRef.current.disconnect();
      } catch (e) {}
      processorRef.current = null;
    }
    if (streamRef.current) {
      try {
        streamRef.current.getTracks().forEach((track) => track.stop());
      } catch (e) {}
      streamRef.current = null;
    }
    if (inputAudioCtxRef.current) {
      try {
        inputAudioCtxRef.current.close().catch(() => {});
      } catch (e) {}
      inputAudioCtxRef.current = null;
    }
    if (outputAudioCtxRef.current) {
      try {
        outputAudioCtxRef.current.close().catch(() => {});
      } catch (e) {}
      outputAudioCtxRef.current = null;
    }
    nextStartTimeRef.current = 0;
  };

  useEffect(() => {
    return () => disconnect();
  }, []);

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ textInput: inputText }));
      setTranscriptLog((prev) => [...prev, { sender: "user", text: inputText }]);
    }
    setInputText("");
  };

  return (
    <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end gap-3 font-sans">
      <AnimatePresence>
        {/* Connection Box & Floating Screen */}
        {(isConnected || isConnecting) && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-80 sm:w-96 bg-slate-900 dark:bg-slate-950 text-white rounded-2xl shadow-2xl border border-slate-800/80 overflow-hidden flex flex-col max-h-[420px]"
            id="voice-receptionist-panel"
          >
            {/* Header */}
            <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16a34a] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#16a34a]"></span>
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-[#16a34a]">Vula Lesedi Call Room</h4>
                  <p className="text-[10px] text-slate-400 font-medium">Thandi • {isConnected ? `Ongoing Call • ${formatDuration(callDuration)}` : 'Dialing...'}</p>
                </div>
              </div>
              <button
                onClick={disconnect}
                className="p-1 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Hang up"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Live Status Indicator / Waveform */}
            <div className="p-4 bg-slate-900/50 flex flex-col items-center justify-center border-b border-slate-800/60">
              {isConnecting ? (
                <div className="flex flex-col items-center gap-2 py-4">
                  <Loader2 className="w-8 h-8 text-[#16a34a] animate-spin" />
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider animate-pulse">Dialing virtual line...</span>
                  <p className="text-[10px] text-slate-500">Connecting you to Thandi...</p>
                </div>
              ) : (
                <div className="w-full flex flex-col items-center gap-3">
                  {/* Dynamic Sound Wave animation */}
                  <div className="flex items-center justify-center gap-1.5 h-10 w-full px-8">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((i) => (
                      <motion.div
                        key={i}
                        className={`w-1 rounded-full ${isMuted ? "bg-amber-500/50" : "bg-[#16a34a]"}`}
                        animate={{
                          height: isMuted ? [10, 10, 10] : [10, Math.random() * 32 + 8, 10]
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 0.6 + i * 0.05,
                          ease: "easeInOut"
                        }}
                      />
                    ))}
                  </div>

                  {/* Dialer Status Row */}
                  <div className="text-center">
                    <span className="text-xs text-[#16a34a] font-black uppercase tracking-wider flex items-center justify-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5" /> ONGOING CALL • {formatDuration(callDuration)}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {isMuted ? "Microphone is muted" : "Speak naturally. Thandi is listening to assist you."}
                    </p>
                  </div>

                  {/* Human Dialer Action Buttons */}
                  <div className="flex items-center gap-4 mt-1 bg-slate-950/60 p-2 px-4 rounded-full border border-slate-800/80">
                    {/* Mute Mic Toggle */}
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className={`p-2 rounded-full transition-all duration-200 transform active:scale-90 flex items-center justify-center cursor-pointer ${
                        isMuted
                          ? "bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 ring-2 ring-amber-500/20"
                          : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                      }`}
                      title={isMuted ? "Unmute microphone" : "Mute microphone"}
                    >
                      {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>

                    {/* RED HANG-UP CALL BUTTON */}
                    <button
                      onClick={disconnect}
                      className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-full transition-all duration-200 transform active:scale-95 flex items-center justify-center cursor-pointer shadow-lg shadow-red-500/20 hover:scale-105"
                      title="End Call / Hang up"
                    >
                      <PhoneOff className="w-5 h-5" />
                    </button>

                    {/* Keyboard Input mode toggle */}
                    <button
                      onClick={() => {
                        setIsMicAvailable(!isMicAvailable);
                        if (isMicAvailable) {
                          setError("Keyboard typewriter mode enabled.");
                        } else {
                          setError(null);
                        }
                      }}
                      className={`p-2 rounded-full transition-all duration-200 transform active:scale-90 flex items-center justify-center cursor-pointer ${
                        !isMicAvailable
                          ? "bg-[#16a34a]/20 text-[#16a34a] hover:bg-[#16a34a]/30 ring-2 ring-[#16a34a]/20"
                          : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                      }`}
                      title="Toggle Keyboard Input"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Transcripts Logs/Keyboard Fallback */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 min-h-[140px] max-h-[180px] bg-slate-950/20 scrollbar-thin scrollbar-thumb-slate-800">
              {transcriptLog.map((log, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${log.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <span className="text-[9px] uppercase font-black tracking-widest text-slate-500 mb-0.5">
                    {log.sender === "user" ? "You" : "Thandi"}
                  </span>
                  <div
                    className={`px-3 py-2 rounded-xl text-xs max-w-[85%] leading-relaxed font-medium ${
                      log.sender === "user"
                        ? "bg-[#16a34a] text-white rounded-tr-none"
                        : "bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700/30"
                    }`}
                  >
                    {log.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Footer */}
            <div className="p-3 bg-slate-950 border-t border-slate-800">
              {!isMicAvailable ? (
                <form onSubmit={handleTextSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type your response to Thandi..."
                    className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700/60 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#16a34a] transition-all"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-2 justify-between">
                  <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                    <Info className="w-3 h-3 text-[#16a34a]" /> Mic active • Speak anytime
                  </span>
                  <button
                    onClick={() => {
                      // Toggle manual keyboard input mode directly
                      setIsMicAvailable(false);
                      setError("Manual typewriter mode enabled.");
                    }}
                    className="text-[10px] text-[#16a34a] hover:underline font-black uppercase tracking-wider cursor-pointer bg-transparent border-0"
                  >
                    Use Keyboard
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {/* Voice Select Dropdown (Only visible before starting call) */}
        {!isConnected && !isConnecting && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-xl flex items-center gap-3"
          >
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Receptionist Voice
              </span>
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-slate-800 dark:text-slate-100 font-bold focus:outline-none focus:ring-2 focus:ring-[#16a34a] mt-1"
              >
                <option value="Aoede">Thandi (Female • Warm & Friendly)</option>
                <option value="Kore">Lerato (Female • Professional)</option>
                <option value="Puck">Sipho (Male • Energetic & Warm)</option>
                <option value="Charon">Kabelo (Male • Calm & Professional)</option>
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary Trigger Toggle Button */}
      <div className="flex items-center gap-3">
        {error && !isConnected && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 px-3.5 py-2 rounded-xl text-xs font-semibold max-w-xs shadow-md"
          >
            {error}
          </motion.div>
        )}

        <AnimatePresence>
          {!isConnected && !isConnecting && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="bg-[#16a34a] text-white text-xs font-black uppercase tracking-wider px-4 py-2 rounded-full shadow-lg select-none hidden sm:block border border-green-500/20 shadow-green-800/10 cursor-pointer"
              onClick={connect}
            >
              Call AI Receptionist (Thandi)
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={isConnected || isConnecting ? disconnect : connect}
          className={`relative p-4.5 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer border ring-4 flex items-center justify-center ${
            isConnected
              ? "bg-red-600 hover:bg-red-700 border-red-600 text-white ring-red-500/20"
              : isConnecting
              ? "bg-slate-800 border-slate-700 text-white ring-slate-500/20"
              : "bg-[#16a34a] hover:bg-[#15803d] border-[#16a34a] text-white ring-green-500/20"
          }`}
          aria-label={isConnected ? "Hang up call" : "Call Virtual Receptionist"}
        >
          {isConnecting ? (
            <Loader2 className="w-6 h-6 animate-spin text-white" />
          ) : isConnected ? (
            <PhoneOff className="w-6 h-6 text-white" />
          ) : (
            <div className="relative">
              <Phone className="w-6 h-6 text-white" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-300 rounded-full border border-[#16a34a] animate-ping" />
            </div>
          )}
        </button>
      </div>
      {/* Lead Verification Overlay Modal */}
      <AnimatePresence>
        {leadVerification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl max-w-md w-full relative"
            >
              <h3 className="text-lg font-black uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-2">Confirm Your Details</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Thandi has recorded the following information for your quote. Please verify it before we proceed.</p>
              
              <div className="space-y-4 mb-8">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700/50">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Full Name</span>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{leadVerification.args?.name || "N/A"}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700/50">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Phone Number</span>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{leadVerification.args?.phone || "N/A"}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700/50">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Email Address</span>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{leadVerification.args?.email || "N/A"}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700/50">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Location</span>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{leadVerification.args?.location || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={() => {
                    if (wsRef.current?.readyState === WebSocket.OPEN) {
                      wsRef.current.send(JSON.stringify({
                        toolResponse: {
                          id: leadVerification.id,
                          name: leadVerification.name,
                          result: "cancelled"
                        }
                      }));
                    }
                    setLeadVerification(null);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  Edit / Cancel
                </button>
                <button
                  onClick={() => {
                    if (wsRef.current?.readyState === WebSocket.OPEN) {
                      wsRef.current.send(JSON.stringify({
                        toolResponse: {
                          id: leadVerification.id,
                          name: leadVerification.name,
                          result: "confirmed",
                          lead: leadVerification.args
                        }
                      }));
                    }
                    setLeadVerification(null);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#16a34a] hover:bg-[#15803d] text-white transition-colors shadow-lg shadow-[#16a34a]/20 cursor-pointer"
                >
                  Confirm & Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
