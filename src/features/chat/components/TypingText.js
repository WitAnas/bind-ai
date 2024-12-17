import React, { useState, useEffect } from "react";

import Markdown from "./Markdown";

const TypingText = ({ text, isTyping, stopTyping, setTypingComplete }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  // useEffect(() => {
  //   if (isTyping) {
  //     const intervalId = setInterval(() => {
  //       if (stopTyping) {
  //         clearInterval(intervalId);
  //         return;
  //       }
  //       setDisplayedText((prevText) => {
  //         return prevText + text.charAt(currentIndex);
  //       });
  //       if (currentIndex >= text.length - 1) {
  //         clearInterval(intervalId);
  //         setTypingComplete(true);
  //       } else {
  //         setCurrentIndex(currentIndex + 1);
  //       }
  //     }, 10);
  //     return () => clearInterval(intervalId);
  //   } else {
  //     setDisplayedText(text);
  //   }
  // }, [currentIndex, isTyping, stopTyping]);
  useEffect(() => {
    if (isTyping) {
      const typeCharacter = () => {
        if (stopTyping || currentIndex >= text?.length) {
          setTypingComplete(true);
          return;
        }
        setDisplayedText((prevText) => prevText + text.charAt(currentIndex));
        setCurrentIndex((prevIndex) => prevIndex + 1);
      };

      const timeoutId = setTimeout(typeCharacter, 10);
      return () => clearTimeout(timeoutId);
    } else {
      setDisplayedText(text);
    }
  }, [isTyping, stopTyping, currentIndex, text, setTypingComplete]);

  // useEffect(() => {
  //   if (!isTyping) {
  //     setDisplayedText(text);
  //   }
  // }, [isTyping, text]);

  const displayText = () => {
    return <Markdown key={displayedText} markdownText={displayedText} />;
  };

  return <>{displayText()}</>;
};

export default TypingText;
