import { View, Text } from "react-native";
import React, { useContext } from "react";
import Avatar from "./Avatar";
import { useRoute } from "@react-navigation/native";
import GlobalContext from "../context/Context";

const ChatHeader = () => {
  const route = useRoute();
  const user = route.params.user;
  const {
    theme: { lightTheme, darkTheme },
    lightMode,
  } = useContext(GlobalContext);
  const theme = lightMode ? lightTheme.colors : darkTheme.colors;
  return (
    <View
      style={{
        flexDirection: "row",
      }}
    >
      <View>
        <Avatar size={40} user={user} />
      </View>
      <View
        style={{
          marginLeft: 15,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: theme.white, fontSize: 18 }}>
          {user?.contactName || user?.displayName}
        </Text>
      </View>
    </View>
  );
};

export default ChatHeader;
