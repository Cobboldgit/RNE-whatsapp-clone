import { TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import GlobalContext from "../context/Context";
import { useNavigation } from "@react-navigation/native";

const ContactsFloatingIcon = () => {
    const {navigate} = useNavigation()
  const {
    theme: { lightTheme, darkTheme },
    lightMode,
  } = useContext(GlobalContext);
  const theme = lightMode ? lightTheme.colors : darkTheme.colors;

  return (
    <TouchableOpacity
    onPress={() => navigate('contacts')}
      style={{
        position: "absolute",
        right: 20,
        bottom: 20,
        borderRadius: 30,
        backgroundColor: theme.secondary,
        alignItems: "center",
        justifyContent: "center",
        height: 60,
        width: 60
      }}
    >
      <MaterialCommunityIcons
        name="android-messages"
        size={30}
        color="white"
        style={{
          transform: [{ scaleX: -1 }],
        }}
      />
    </TouchableOpacity>
  );
};

export default ContactsFloatingIcon;
