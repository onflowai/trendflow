import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import AudioControls from './AudioControls';

/**
 * Browser base tts
 * @param {} md 
 * @returns 
 */
const markdownToSpeechText = (md = '') => {
  let t = String(md);
  t = t.replace(/```[\s\S]*?```/g, ''); // code blocks
  t = t.replace(/`([^`]+)`/g, '$1'); // inline code
  t = t.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '$1'); // links
  t = t.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '$1'); // images
  t = t.replace(/^#{1,6}\s+/gm, ''); // headings
  t = t.replace(/^\s*[-*+]\s+/gm, ''); // bullets
  t = t.replace(/^\s*\d+\.\s+/gm, ''); // numbered lists
  t = t.replace(/\n{3,}/g, '\n\n').trim(); // whitespace
  return t;
};

const BrowserWebSpeech = ({ text, rate = 1, pitch = 1, className }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utterRef = useRef(null);

  const ttsSupported =
    typeof window !== 'undefined' &&
    !!window.speechSynthesis &&
    !!window.SpeechSynthesisUtterance;

  const speechText = useMemo(() => markdownToSpeechText(text), [text]);

  useEffect(() => {
    if (ttsSupported && window.speechSynthesis.speaking) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  }, [text]);

  const speak = () => {
    if (!ttsSupported) return;
    if (!speechText) return;

    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(speechText);
    utterRef.current = utter;

    utter.rate = rate;
    utter.pitch = pitch;

    utter.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };
    utter.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    utter.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utter);
  };

  const cancel = () => {
    if (!ttsSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  const pause = () => {
    if (!ttsSupported) return;
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const resume = () => {
    if (!ttsSupported) return;
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  if (!ttsSupported) return null;

  return (
    <Wrap className={className}>
      <AudioControls
        isActive={isSpeaking}
        isPaused={isPaused}
        onStart={speak}
        onPause={pause}
        onResume={resume}
        onCancel={cancel}
        showLoading={true}
      />
    </Wrap>
  );
};

export default BrowserWebSpeech;

const Wrap = styled.div``;