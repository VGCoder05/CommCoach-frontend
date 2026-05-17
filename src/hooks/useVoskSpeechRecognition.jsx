import { useState, useEffect, useRef } from 'react';
import { createModel, createRecognizer } from 'vosk-browser';

export const useVoskSpeechRecognition = () => {
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const modelRef = useRef(null);
  const recognizerRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  // Load model on mount
  useEffect(() => {
    const loadModel = async () => {
      try {
        const model = await createModel('/models/vosk-model-small-en-us-0.15');
        modelRef.current = model;
        
        const recognizer = await createRecognizer(model, 16000);
        recognizerRef.current = recognizer;
        
        recognizer.on('result', (message) => {
          const result = message.result?.text;
          if (result) {
            setTranscript(prev => prev + ' ' + result);
          }
        });
        
        setIsLoading(false);
      } catch (err) {
        console.error('Vosk model load error:', err);
      }
    };

    loadModel();

    return () => {
      recognizerRef.current?.remove();
      modelRef.current?.terminate();
    };
  }, []);

  const startListening = async () => {
    if (!recognizerRef.current) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new AudioContext({ sampleRate: 16000 });
      const source = audioContext.createMediaStreamSource(stream);
      
      await recognizerRef.current.acceptWaveform(source);
      
      setListening(true);
      mediaRecorderRef.current = { stream, audioContext };
    } catch (err) {
      console.error('Mic access error:', err);
    }
  };

  const stopListening = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      mediaRecorderRef.current.audioContext.close();
      mediaRecorderRef.current = null;
    }
    setListening(false);
  };

  const resetTranscript = () => {
    setTranscript('');
  };

  return {
    transcript,
    listening,
    isLoading,
    startListening,
    stopListening,
    resetTranscript,
  };
};