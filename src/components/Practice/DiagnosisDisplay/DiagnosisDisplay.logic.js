import { useState } from 'react';

export const useDiagnosisDisplayLogic = () => {
  const [activeTab, setActiveTab] = useState('vocabulary');

  const readAloud = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 0.9;
    window.speechSynthesis.speak(utt);
  };

  return { activeTab, setActiveTab, readAloud };
};