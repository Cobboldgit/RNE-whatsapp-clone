import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, LogBox } from "react-native";
import { useAssets } from "expo-asset";
import { useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebase";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import SignIn from "./screens/SignIn";
import Profile from "./screens/Profile";
import Home from "./screens/Home";
import Context from "./context/Context";
import Contacts from "./screens/Contacts";
import Chat from "./screens/Chat";
import ChatHeader from "./components/ChatHeader";
import ContextWrapper from "./context/ContextWrapper";
//imports

// body of the app
LogBox.ignoreLogs(["Setting instance name", "AsyncStorage"]);

//stack
const Stack = createNativeStackNavigator();

const App = () => {
  const [currUser, setCurrUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const {
    theme: { lightTheme, darkTheme },
    lightMode,
  } = useContext(Context);
  const theme = lightMode ? lightTheme.colors : darkTheme.colors;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrUser(user);
        setLoading(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <NavigationContainer>
      {!currUser ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="signIn" component={SignIn} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.foreground,
            },
            headerTintColor: theme.white,
            headerShadowVisible: false,
          }}
        >
          {!currUser?.displayName && (
            <Stack.Screen
              name="profile"
              component={Profile}
              options={{
                headerShown: false,
              }}
            />
          )}
          <Stack.Screen
            name="home"
            component={Home}
            options={{
              title: "Whatsapp",
              headerBackVisible: false,
            }}
          />
          <Stack.Screen
            name="contacts"
            component={Contacts}
            options={{
              title: "Select contact",
            }}
          />
          <Stack.Screen
            name="chat"
            component={Chat}
            options={{
              headerTitle: (props) => <ChatHeader {...props} />,
            }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

// Main export of the app
const Main = () => {
  const [assets] = useAssets(
    require("./assets/icons/icon-square.png"),
    require("./assets/icons/chatbg.png"),
    require("./assets/icons/user-icon.png"),
    require("./assets/icons/welcome-img.png")
  );
  if (!assets) {
    return <Text>Loading...</Text>;
  }

  return (
    <ContextWrapper>
      <App />
    </ContextWrapper>
  );
};

export default Main;
