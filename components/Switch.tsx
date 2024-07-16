import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import Animated, { interpolate, useAnimatedStyle } from "react-native-reanimated";

interface SwitchProps {
  activeToggle: number;
  setToggleActive: (active: number) => void;
  values: { label: string; icon: React.ReactElement; activeColor: string; inactiveColor: string }[];
}
const Switch = ({ setToggleActive, values, activeToggle }: SwitchProps) => {
  const [activeOption, setActiveOption] = useState(activeToggle);
  const [animatedTextValue, setAnimatedTextValue] = useState(
    activeToggle === 0 ? values[0].label : values[1].label
  );

  const AnimatedTouchableWithoutFeedback =
    Animated.createAnimatedComponent(TouchableWithoutFeedback);

  const toggleOption = () => {
    setAnimatedTextValue(activeOption === 0 ? values[1].label : values[0].label);
    setActiveOption(activeOption === 0 ? 1 : 0);
    setToggleActive(activeOption === 0 ? 1 : 0);
  };

  const viewAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(activeOption, [0, 1], [0, 1]),
        },
      ],
    };
  });

  return (
    <AnimatedTouchableWithoutFeedback onPress={toggleOption} style={styles.container}>
      {activeOption === 1 && (
        <Animated.View
          style={{
            width: 121,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            gap: 5,
          }}
        >
          {React.cloneElement(values[0].icon, { color: values[0].inactiveColor })}
          <Animated.Text
            style={[
              {
                color: "white",
              },
            ]}
          >
            {values[0].label}
          </Animated.Text>
        </Animated.View>
      )}
      <Animated.View
        style={[
          {
            height: 28,
            width: 121,
            backgroundColor: "white",
            borderRadius: 11,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            gap: 5,
          },
          viewAnimatedStyle,
        ]}
      >
        <Animated.View>
          {React.cloneElement(
            animatedTextValue === values[0].label ? values[0].icon : values[1].icon,
            {
              color:
                animatedTextValue === values[0].label
                  ? values[0].activeColor
                  : values[1].activeColor,
            }
          )}
        </Animated.View>

        <Animated.Text style={{ color: Colors.primary }}>{animatedTextValue}</Animated.Text>
      </Animated.View>
      {activeOption === 0 && (
        <Animated.View
          style={{
            width: 121,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            gap: 5,
          }}
        >
          {React.cloneElement(values[1].icon, { color: values[1].inactiveColor })}
          <Animated.Text
            style={[
              {
                color: "white",
              },
            ]}
          >
            {values[1].label}
          </Animated.Text>
        </Animated.View>
      )}
    </AnimatedTouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 250,
    height: 35,
    padding: 4,
    backgroundColor: Colors.primary,
    borderRadius: 15,
    alignItems: "center",
    overflow: "hidden",
    flexDirection: "row",
  },
  toggle: {
    flexDirection: "row",
  },
  option: {
    flex: 1,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 16,
    color: "#555",
  },
});

export default Switch;
