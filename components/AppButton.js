import {
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from "react-native";
import React, { useContext } from "react";
import Context from "../context/Context";

const AppButton = ({ title, color, disabled, style }) => {
  const {
    theme: { lightTheme, darkTheme },
  } = useContext(Context);

  const theme = lightMode ? lightTheme.colors : darkTheme.colors;

  const renderButton = () => {
    return (
      <View
        style={style}
      >
        <Text
          style={{
            color,
          }}
        >
          {title}
        </Text>
      </View>
    );
  };

  return Platform.OS === "android" ? (
    <TouchableWithoutFeedback disabled={disabled}>{renderButton()}</TouchableWithoutFeedback>
  ) : (
    <TouchableOpacity disabled={disabled}>{renderButton()}</TouchableOpacity>
  );
};

const Styles = StyleSheet.create({
  button: {
    height: 100,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AppButton;
