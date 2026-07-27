import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Sparkles, Send, Loader2, Play, Pause, CheckCircle2, Square, Clock, Settings2 } from 'lucide-react';
import { speechController } from '../utils/speech';
import { VoiceAssistantState } from '../types';
import { TaTaLogo } from './TaTaLogo';

interface VoiceAssistantOrbProps {
  onVoiceCommandSubmitted: (transcript: string) => Promise<void>;
  voiceState: VoiceAssistantState;
  setVoiceState: React.Dispatch<React.SetStateAction<VoiceAssistantState>>;
}

export const VoiceAssistantOrb: React.FC<VoiceAssistantOrbProps> = ({
  onVoiceCommandSubmitted,
  voiceState,
  setVoiceState
}) => {
  const [interimText, setInterimText] = useState('');
  const [manualInput, setManualInput] = useState('');
  const [audioError, setAudioError] = useState<string | null>(null);
  const [silenceDelaySec, setSilenceDelaySec] = useState<number>(3); // 3 seconds pause delay default
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const silenceTimeoutRef = useRef<any>(null);
  const latestTextRef = useRef<string>('');

  const quickPrompts = [
    '☕ "Remind me to buy coffee at 3:00 PM"',
    '🚗 "Car oil change service tomorrow at 2 PM"',
    '🥗 "Set task for team lunch meeting at 12:30 PM"',
    '🌤️ "What is today\'s weather and air quality?"',
    '🏋️ "Gym session and cardio workout at 6 PM"'
  ];

  // Clean up silence timer on unmount
  useEffect(() => {
    return () => {
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
    };
  }, []);

  const clearSilenceTimer = () => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
  };

  const handleToggleListening = () => {
    setAudioError(null);
    clearSilenceTimer();

    if (voiceState.isListening) {
      // Manual stop by tapping orb
      speechController.stopListening();
      const currentText = latestTextRef.current.trim();
      setVoiceState(prev => ({ ...prev, isListening: false }));

      if (currentText) {
        submitCommand(currentText);
      }
    } else {
      setVoiceState(prev => ({ ...prev, isListening: true }));
      setInterimText('');
      latestTextRef.current = '';

      const started = speechController.startListening({
        onResult: (text) => {
          latestTextRef.current = text;
          setInterimText(text);

          // Reset silence debounce timer
          clearSilenceTimer();

          // Auto-submit after silenceDelaySec of inactivity if enabled
          if (silenceDelaySec > 0 && text.trim()) {
            silenceTimeoutRef.current = setTimeout(() => {
              speechController.stopListening();
              setVoiceState(prev => ({ ...prev, isListening: false }));
              const textToSubmit = latestTextRef.current.trim();
              if (textToSubmit) {
                submitCommand(textToSubmit);
              }
            }, silenceDelaySec * 1000);
          }
        },
        onError: (err) => {
          clearSilenceTimer();
          setAudioError(err);
          setVoiceState(prev => ({ ...prev, isListening: false }));
        },
        onEnd: () => {
          // If ended by speech engine
          setVoiceState(prev => ({ ...prev, isListening: false }));
        }
      });

      if (!started) {
        setVoiceState(prev => ({ ...prev, isListening: false }));
      }
    }
  };

  const handleManualDoneSpeaking = () => {
    clearSilenceTimer();
    speechController.stopListening();
    setVoiceState(prev => ({ ...prev, isListening: false }));
    const textToSubmit = latestTextRef.current.trim() || interimText.trim();
    if (textToSubmit) {
      submitCommand(textToSubmit);
    }
  };

  const handleCancelListening = () => {
    clearSilenceTimer();
    speechController.stopListening();
    setVoiceState(prev => ({ ...prev, isListening: false }));
    setInterimText('');
    latestTextRef.current = '';
  };

  const submitCommand = async (textToSubmit: string) => {
    if (!textToSubmit.trim()) return;
    clearSilenceTimer();
    setVoiceState(prev => ({
      ...prev,
      isProcessing: true,
      lastTranscript: textToSubmit
    }));
    await onVoiceCommandSubmitted(textToSubmit);
    setInterimText('');
    setManualInput('');
    latestTextRef.current = '';
  };

  const handlePlaySpokenReply = () => {
    if (!voiceState.spokenReply) return;
    if (voiceState.isSpeaking) {
      speechController.stopSpeaking();
      setVoiceState(prev => ({ ...prev, isSpeaking: false }));
    } else {
      setVoiceState(prev => ({ ...prev, isSpeaking: true }));
      speechController.speak(voiceState.spokenReply, () => {
        setVoiceState(prev => ({ ...prev, isSpeaking: false }));
      });
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
      {/* Background glow effects */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
        
        {/* Header Title & Settings button */}
        <div className="flex items-center justify-between w-full mb-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs font-medium text-cyan-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Voice-First Continuous Speech Mode</span>
          </div>

          <button
            id="btn-toggle-speech-settings"
            onClick={() => setShowSettings(!showSettings)}
            className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 transition-colors"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>Pause Delay ({silenceDelaySec === 0 ? 'Manual' : `${silenceDelaySec}s`})</span>
          </button>
        </div>

        {/* Settings Tray for Silence Delay */}
        {showSettings && (
          <div className="w-full my-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2 text-slate-300">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Auto-capture pause delay:</span>
            </div>
            <div className="flex items-center gap-1.5">
              {[2, 3, 5, 0].map((sec) => (
                <button
                  key={sec}
                  onClick={() => setSilenceDelaySec(sec)}
                  className={`px-2.5 py-1 rounded-md font-medium text-xs transition-colors ${
                    silenceDelaySec === sec
                      ? 'bg-cyan-600 text-white font-bold'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {sec === 0 ? 'Manual Only' : `${sec} seconds`}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-center gap-2 mb-2">
          <TaTaLogo size={36} />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Speak to TaTa Assistant
          </h2>
        </div>
        <p className="text-sm text-slate-400 mt-1 max-w-lg mx-auto">
          Speak freely at your own pace. TaTa accumulates your speech and waits for {silenceDelaySec > 0 ? `${silenceDelaySec} seconds of silence` : 'you to tap Done'} before processing!
        </p>

        {/* Animated Visual Voice Orb */}
        <div className="my-8 relative flex items-center justify-center">
          
          {/* Pulsing rings when listening */}
          {voiceState.isListening && (
            <>
              <div className="absolute w-44 h-44 rounded-full border-2 border-cyan-400/40 animate-ping" />
              <div className="absolute w-56 h-56 rounded-full border border-blue-500/20 animate-pulse" />
            </>
          )}

          {/* Glowing Voice Orb Core */}
          <button
            id="btn-voice-orb-trigger"
            onClick={handleToggleListening}
            disabled={voiceState.isProcessing}
            className={`relative group w-32 h-32 sm:w-36 sm:h-36 rounded-full flex flex-col items-center justify-center transition-all duration-300 transform active:scale-95 shadow-2xl ${
              voiceState.isListening
                ? 'bg-gradient-to-br from-rose-500 via-pink-600 to-red-600 text-white shadow-rose-500/50 ring-4 ring-rose-400/50 scale-105'
                : voiceState.isProcessing
                ? 'bg-gradient-to-br from-amber-500 via-orange-600 to-yellow-600 text-white shadow-amber-500/30'
                : voiceState.isSpeaking
                ? 'bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-600 text-white shadow-purple-500/50 ring-4 ring-purple-400/30'
                : 'bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 text-white shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105'
            }`}
          >
            {voiceState.isProcessing ? (
              <>
                <Loader2 className="w-10 h-10 animate-spin text-white mb-1" />
                <span className="text-xs font-semibold">Processing...</span>
              </>
            ) : voiceState.isListening ? (
              <>
                <Mic className="w-12 h-12 text-white animate-bounce mb-1" />
                <span className="text-xs font-bold uppercase tracking-wider">Listening</span>
              </>
            ) : (
              <>
                <Mic className="w-12 h-12 text-white group-hover:scale-110 transition-transform mb-1" />
                <span className="text-xs font-semibold">Tap to Speak</span>
              </>
            )}
          </button>
        </div>

        {/* Done / Cancel Action Bar while Listening */}
        {voiceState.isListening && (
          <div className="flex items-center gap-3 mb-4 animate-in fade-in">
            <button
              id="btn-done-speaking"
              onClick={handleManualDoneSpeaking}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 transition-all transform active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Done Speaking (Send)</span>
            </button>
            <button
              id="btn-cancel-recording"
              onClick={handleCancelListening}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium px-4 py-2 rounded-xl text-xs border border-slate-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Realtime Transcript or Processing Feedback */}
        <div className="w-full min-h-[52px] bg-slate-950/80 rounded-xl border border-slate-800/80 p-3 flex flex-col items-center justify-center">
          {voiceState.isListening ? (
            <div className="flex flex-col items-center gap-1 text-rose-300 text-xs sm:text-sm font-medium">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span className="text-white font-semibold">{interimText || 'Listening... Speak at your own pace.'}</span>
              </div>
              <span className="text-[11px] text-slate-400 font-normal">
                {silenceDelaySec > 0
                  ? `Will process after ${silenceDelaySec}s of silence or tap "Done Speaking"`
                  : 'Tap "Done Speaking" when you finish'}
              </span>
            </div>
          ) : voiceState.isProcessing ? (
            <div className="flex items-center gap-2 text-amber-300 text-sm font-medium">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing speech with Gemini AI...</span>
            </div>
          ) : voiceState.lastTranscript ? (
            <div className="flex items-center gap-2 text-slate-200 text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Last command: <strong className="text-cyan-300">"{voiceState.lastTranscript}"</strong></span>
            </div>
          ) : (
            <span className="text-xs text-slate-500">Tap the microphone orb above or choose a voice prompt below</span>
          )}
        </div>

        {/* Audio error banner if any */}
        {audioError && (
          <div className="w-full mt-3 p-2.5 rounded-lg bg-amber-950/60 border border-amber-800/80 text-amber-300 text-xs">
            {audioError} (You can use the input box below)
          </div>
        )}

        {/* AI Spoken Voice Reply Audio Controller */}
        {voiceState.spokenReply && (
          <div className="w-full mt-4 p-4 rounded-xl bg-gradient-to-r from-slate-950 via-indigo-950/40 to-slate-950 border border-indigo-900/60 flex items-center justify-between text-left">
            <div className="flex items-center gap-3">
              <button
                id="btn-play-spoken-reply"
                onClick={handlePlaySpokenReply}
                className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95 shrink-0"
              >
                {voiceState.isSpeaking ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
              <div>
                <p className="text-[11px] font-semibold uppercase text-cyan-400 tracking-wider">TaTa Voice Response</p>
                <p className="text-xs text-slate-200 line-clamp-2 mt-0.5">{voiceState.spokenReply}</p>
              </div>
            </div>
            <button
              id="btn-silence-speech"
              onClick={() => {
                speechController.stopSpeaking();
                setVoiceState(prev => ({ ...prev, isSpeaking: false }));
              }}
              className="text-xs text-slate-400 hover:text-slate-200 p-2"
              title="Silence Audio"
            >
              <VolumeX className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Text Input Fallback */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (manualInput.trim()) submitCommand(manualInput);
          }}
          className="w-full mt-4 flex items-center gap-2"
        >
          <input
            id="input-voice-text-fallback"
            type="text"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder="Or type a voice command (e.g. Remind me to buy coffee at 3pm)..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          />
          <button
            id="btn-submit-manual-command"
            type="submit"
            disabled={!manualInput.trim() || voiceState.isProcessing}
            className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all shadow-md shrink-0"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </form>

        {/* Quick Voice Prompt Chips */}
        <div className="w-full mt-5">
          <p className="text-xs font-medium text-slate-400 text-left mb-2">Try saying or clicking a voice instruction:</p>
          <div className="flex flex-wrap gap-2 text-left">
            {quickPrompts.map((promptText, idx) => {
              const cleanText = promptText.replace(/^[^\"]*\"([^\"]*)\".*$/, '$1');
              return (
                <button
                  key={idx}
                  id={`btn-quick-prompt-${idx}`}
                  onClick={() => submitCommand(cleanText)}
                  disabled={voiceState.isProcessing}
                  className="bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 text-slate-200 px-3 py-1.5 rounded-lg text-xs transition-all hover:border-cyan-500/50"
                >
                  {promptText}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
