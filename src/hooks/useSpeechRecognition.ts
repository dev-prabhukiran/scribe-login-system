import { useState, useEffect, useRef, useCallback } from "react";

interface UseSpeechRecognitionReturn {
  isListening: boolean;
  interimText: string;
  startListening: () => void;
  stopListening: () => void;
  toggleListening: () => void;
  isSupported: boolean;
  permissionGranted: boolean | null;
}

export function useSpeechRecognition(
  onFinalTranscript: (text: string) => void
): UseSpeechRecognitionReturn {
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [isSupported] = useState(() => "webkitSpeechRecognition" in window || "SpeechRecognition" in window);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const recognitionRef = useRef<any>(null);
  const shouldRestart = useRef(false);

  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }
      setInterimText(interim);

      if (final) {
        // Check for activation words
        const lower = final.toLowerCase().trim();
        if (lower.includes("stop recording")) {
          stopListening();
          return;
        }
        onFinalTranscript(final);
      }
    };

    recognition.onend = () => {
      if (shouldRestart.current) {
        try { recognition.start(); } catch {}
      } else {
        setIsListening(false);
        setInterimText("");
      }
    };

    recognition.onerror = (event: any) => {
      if (event.error === "not-allowed") {
        setPermissionGranted(false);
      }
      if (event.error !== "no-speech" && event.error !== "aborted") {
        shouldRestart.current = false;
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      shouldRestart.current = false;
      try { recognition.stop(); } catch {}
    };
  }, [isSupported, onFinalTranscript]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    shouldRestart.current = true;
    setIsListening(true);
    setPermissionGranted(true);
    try { recognitionRef.current.start(); } catch {}
  }, []);

  const stopListening = useCallback(() => {
    shouldRestart.current = false;
    setIsListening(false);
    setInterimText("");
    try { recognitionRef.current?.stop(); } catch {}
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) stopListening();
    else startListening();
  }, [isListening, startListening, stopListening]);

  return { isListening, interimText, startListening, stopListening, toggleListening, isSupported, permissionGranted };
}
