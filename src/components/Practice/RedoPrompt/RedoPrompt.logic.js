import { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

export const useRedoPromptLogic = ({ onSubmit, sessionId, isDiagnosing }) => {
  const [answer, setAnswer] = useState('');

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) setAnswer(transcript);
  }, [transcript]);

  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;

  const handleVoiceToggle = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  const handleSubmit = () => {
    if (!answer.trim() || isDiagnosing) return;
    onSubmit(answer.trim(), sessionId);
  };

  return {
    answer,
    setAnswer,
    wordCount,
    listening,
    browserSupportsSpeechRecognition,
    handleVoiceToggle,
    handleSubmit,
  };
};