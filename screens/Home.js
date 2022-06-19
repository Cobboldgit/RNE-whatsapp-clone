import { View, Text } from "react-native";
import React, { useContext } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Chats from "../screens/Chats";
import Photo from "../screens/Photo";
import { Ionicons } from "@expo/vector-icons";
import GlobalContext from "../context/Context";

const Tab = createMaterialTopTabNavigator();

const Home = () => {
  const {
    theme: { lightTheme, darkTheme },
    lightMode,
  } = useContext(GlobalContext);
  const theme = lightMode ? lightTheme.colors : darkTheme.colors;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        return {
          tabBarLabel: () => {
            if (route.name === "photo") {
              return <Ionicons name="camera" size={20} color={theme.white} />;
            } else {
              return (
                <Text
                  style={{
                    color: theme.white,
                  }}
                >
                  {route?.name.toLocaleLowerCase()}
                </Text>
              );
            }
          },
          tabBarShowIcon: true,
          tabBarIndicatorStyle: {
            backgroundColor: theme.white,
          },
          tabBarStyle: {
            backgroundColor: theme.foreground,
          },
        };
      }}
      initialRouteName="chats"
    >
      <Tab.Screen name="photo" component={Photo} />
      <Tab.Screen name="chats" component={Chats} />
    </Tab.Navigator>
  );
};

export default Home;
