import { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

export const useAnswerInputLogic = ({ onSubmit, isDiagnosing }) => {
  const [answer, setAnswer] = useState('');

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    browserSupportsContinuousListening, 
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) setAnswer(transcript);
  }, [transcript]);

  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;

  const handleToggleVoice = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({
        continuous: browserSupportsContinuousListening, 
        language: 'en-US',
      });
    }
  };

  const handleClear = () => {
    setAnswer('');
    resetTranscript();
  };

  const handleSubmit = () => {
    if (!answer.trim() || isDiagnosing) return;
    onSubmit(answer.trim());
  };

  return {
    answer,
    setAnswer,
    wordCount,
    listening,
    browserSupportsSpeechRecognition,
    browserSupportsContinuousListening, 
    handleToggleVoice,
    handleClear,
    handleSubmit,
  };
};