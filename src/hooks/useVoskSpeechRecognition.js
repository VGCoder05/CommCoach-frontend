import { useState, useEffect, useRef } from 'react';
import { createModel } from 'vosk-browser';

// ✅ Module-level cache — survives component remounts, resets only on page refresh
let cachedModel = null;
let cachedRecognizer = null;
let modelLoadError = null;

export const useVoskSpeechRecognition = () => {
  const [transcript, setTranscript]   = useState('');
  const [listening,  setListening]    = useState(false);
  // ✅ If cache already has the model, start as NOT loading
  const [isLoading,  setIsLoading]    = useState(!cachedModel);
  const [error,      setError]        = useState(modelLoadError);

  const recognizerRef  = useRef(cachedRecognizer);
  const audioContextRef = useRef(null);
  const streamRef       = useRef(null);
  const processorRef    = useRef(null);

  useEffect(() => {
    // ✅ Model already loaded from a previous mount — skip loading entirely
    if (cachedModel && cachedRecognizer) {
      recognizerRef.current = cachedRecognizer;
      setIsLoading(false);
      return;
    }

    const loadModel = async () => {
      try {
        const model = await createModel('https://ccoreilly.github.io/vosk-browser/models/vosk-model-small-en-us-0.15.tar.gz');

        const recognizer = new model.KaldiRecognizer(16000);

        recognizer.on('result', (message) => {
          const text = message.result?.text;
          if (text) setTranscript(prev => (prev + ' ' + text).trim());
        });

        recognizer.on('partialresult', (message) => {
          console.log('Partial:', message.result?.partial);
        });

        // ✅ Save to module-level cache
        cachedModel      = model;
        cachedRecognizer = recognizer;
        recognizerRef.current = recognizer;

        setIsLoading(false);
      } catch (err) {
        modelLoadError = err.message || 'Failed to load model';
        setError(modelLoadError);
        setIsLoading(false);
      }
    };

    loadModel();

    return () => {
      // ✅ Do NOT terminate on unmount — model stays cached for reuse
      // Only disconnect audio resources
    };
  }, []);

  const startListening = async () => {
    if (!recognizerRef.current || isLoading) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, channelCount: 1 },
      });

      streamRef.current = stream;

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const source    = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (event) => {
        recognizerRef.current?.acceptWaveform(event.inputBuffer);
      };

      source.connect(processor);
      processor.connect(audioContext.destination);

      setListening(true);
    } catch (err) {
      setError('Microphone access denied');
    }
  };

  const stopListening = () => {
    processorRef.current?.disconnect();
    processorRef.current = null;

    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;

    if (audioContextRef.current?.state !== 'closed') {
      audioContextRef.current?.close();
    }
    audioContextRef.current = null;

    setListening(false);
  };

  const resetTranscript = () => setTranscript('');

  return { transcript, listening, isLoading, error, startListening, stopListening, resetTranscript };
};