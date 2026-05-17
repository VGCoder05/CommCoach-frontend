import { useState, useEffect, useRef } from 'react';
import { createModel } from 'vosk-browser';

export const useVoskSpeechRecognition = () => {
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const modelRef = useRef(null);
  const recognizerRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  // Load model on mount
  useEffect(() => {
    const loadModel = async () => {
      try {
        
        const model = await createModel('/models/vosk-model-small-en-us-0.15.tar.gz');
        modelRef.current = model;
        
        
        const recognizer = new model.KaldiRecognizer(16000);
        recognizerRef.current = recognizer;
        
        recognizer.on('result', (message) => {
          const result = message.result?.text;
          if (result) {
            setTranscript(prev => (prev + ' ' + result).trim());
          }
        });

        recognizer.on('partialresult', (message) => {
          // Optional: show partial results while speaking
          const partial = message.result?.partial;
          if (partial) {
            console.log('Partial:', partial);
          }
        });
        
        setIsLoading(false);
      } catch (err) {
        console.error('Vosk model load error:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    loadModel();

    return () => {
      if (recognizerRef.current) {
        recognizerRef.current.remove();
      }
      if (modelRef.current) {
        modelRef.current.terminate();
      }
    };
  }, []);

  const startListening = async () => {
    if (!recognizerRef.current || isLoading) {
      console.warn('Model not loaded yet');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
        } 
      });
      
      const audioContext = new AudioContext({ sampleRate: 16000 });
      const source = audioContext.createMediaStreamSource(stream);
      
      
      await recognizerRef.current.acceptWaveform(source);
      
      setListening(true);
      mediaRecorderRef.current = { stream, audioContext, source };
    } catch (err) {
      console.error('Mic access error:', err);
      setError('Microphone access denied');
    }
  };

  const stopListening = () => {
    if (mediaRecorderRef.current) {
      const { stream, audioContext, source } = mediaRecorderRef.current;
      
      // Stop all tracks
      stream.getTracks().forEach(track => track.stop());
      
      // Disconnect and close
      if (source) source.disconnect();
      if (audioContext && audioContext.state !== 'closed') {
        audioContext.close();
      }
      
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
    error,
    startListening,
    stopListening,
    resetTranscript,
  };
};