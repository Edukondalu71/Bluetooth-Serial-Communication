import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const AnimatedTypewriterText = ({
  sentences,
  delay = 1000,
  speed = 70,
  style,
  cursorSymbol = '|',
}) => {
  const [animatedText, setAnimatedText] = useState('');
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (currentSentenceIndex < sentences.length) {
      startTypingAnimation();
    }
  }, [currentSentenceIndex]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prevState) => !prevState);
    }, 500);

    return () => {
      clearInterval(cursorInterval);
    };
  }, []);

  const startTypingAnimation = () => {
    const currentSentence = sentences[currentSentenceIndex];
    let index = 0;

    const typingInterval = setInterval(() => {
      setAnimatedText((prevText) => prevText + currentSentence[index]);
      index++;

      if (index === currentSentence.length) {
        clearInterval(typingInterval);

        // Delay before moving to the next sentence
        setTimeout(() => {
          if (currentSentenceIndex < sentences.length - 1) {
            setCurrentSentenceIndex((prevIndex) => prevIndex + 1);
          }
          setAnimatedText('');
        }, delay);
      }
    }, speed);
  };

  return (
    <View style={style}>
      <Text style={styles.text}>
        {animatedText}
        {showCursor && <Text style={styles.cursor}>{cursorSymbol}</Text>}
      </Text>
    </View>
  );
};

const AnimatedTyping = () => {
  return (
    <View style={styles.container}>
      <AnimatedTypewriterText
        sentences={[
          'Hi, I am Aswin.',
          'I am a software developer.',
          'I am passionate about coding.',
          'I love learning new technologies.',
          'Enjoy your day!',
        ]}
        delay={1000}
        speed={70}
        style={styles.textContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    color: '#333',
  },
  cursor: {
    color: '#333',
    opacity: 0.7,
  },
});

export default AnimatedTyping;
