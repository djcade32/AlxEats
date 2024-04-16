import { StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import Font from "@/constants/Font";

const AnimatedWords = () => {
  // Can't decide if I want this or the other
  //   const words = ["Discover.", " ", "Dine.", " ", "Share.", " ", "Discover. Dine. Share."];
  const words = ["Discover.", "Dine.", "Share.", " ", "Discover. Dine. Share."];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex === words.length - 1) {
      return;
    }

    setTimeout(() => {
      setCurrentIndex(currentIndex + 1);
    }, 2000);
  }, [currentIndex]);
  return (
    <View
      style={{
        position: "relative",
        width: 300,
        height: 30,
        marginTop: 60,
      }}
    >
      {words[currentIndex] === "Discover." && (
        <Animated.Text
          entering={FadeIn.duration(2000)}
          exiting={FadeOut.duration(2000)}
          style={styles.subtitle}
        >
          Discover.
        </Animated.Text>
      )}
      {words[currentIndex] === "Dine." && (
        <Animated.Text
          entering={FadeIn.duration(2000)}
          exiting={FadeOut.duration(2000)}
          style={styles.subtitle}
        >
          Dine.
        </Animated.Text>
      )}
      {words[currentIndex] === "Share." && (
        <Animated.Text
          entering={FadeIn.duration(2000)}
          exiting={FadeOut.duration(2000)}
          style={styles.subtitle}
        >
          Share.
        </Animated.Text>
      )}
      {currentIndex === words.length - 1 && (
        <Animated.Text entering={FadeIn.duration(2000)} style={styles.subtitle}>
          Discover. Dine. Share.
        </Animated.Text>
      )}
    </View>
  );
};

export default AnimatedWords;

const styles = StyleSheet.create({
  subtitle: {
    color: "white",
    fontSize: Font.medium,
    fontFamily: "nycd",
    position: "absolute",
    left: 0,
    right: 0,
    width: "100%",
    textAlign: "center",
  },
});
