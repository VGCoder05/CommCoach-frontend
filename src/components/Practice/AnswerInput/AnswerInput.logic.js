import { useState } from 'react';
import { useVoskSpeechRecognition } from '../../../hooks/useVoskSpeechRecognition';

export const useAnswerInputLogic = ({ onSubmit, isDiagnosing }) => {
  const [answer, setAnswer] = useState('');

  const {
    transcript,
    listening,
    isLoading,
    startListening,
    stopListening,
    resetTranscript,
  } = useVoskSpeechRecognition();

  useEffect(() => {
    if (transcript) setAnswer(transcript.trim());
  }, [transcript]);

  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;

  const handleToggleVoice = () => {
    if (listening) {
      stopListening();
    } else {
      resetTranscript();
      startListening();
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
    isLoading,
    handleToggleVoice,
    handleClear,
    handleSubmit,
  };
};