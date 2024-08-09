import { useState, useEffect } from 'react';

const useTypingEffect = (text, speed = 2) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    // Reset displayed text when new text arrives
    setDisplayedText('');
    
    // Edge case check to avoid processing undefined text
    if (!text) {
      return;
    }

    let index = 0;
    const intervalId = setInterval(() => {
      setDisplayedText((prev) => prev + text[index]);
      index += 1;
      if (index >= text.length) {
        clearInterval(intervalId);
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed]);

  return displayedText;
};

export default useTypingEffect;
