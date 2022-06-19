import { Image } from "react-native";
import React, { useContext } from "react";
import GlobalContext from "../context/Context";

const Avatar = ({ size, user }) => {
  const {
    theme: { lightTheme, darkTheme },
    lightMode,
  } = useContext(GlobalContext);

  const icon = lightMode ? lightTheme.icons : darkTheme.icons;
  return (
    <Image
      source={user?.photoURL ? { uri: user?.photoURL } : icon.square}
      style={{
        height: size,
        width: size,
        borderRadius: size,
      }}
      resizeMode="cover"
    />
  );
};

export default Avatar;
