import {
  View,
  Text,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useState } from "react";
import Context from "../context/Context";
import AppButton from "../components/AppButton";
import { signUp, signIn } from "../firebase/actions";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("signUp");

  const {
    theme: { lightTheme, darkTheme },
    lightMode,
  } = useContext(Context);

  const theme = lightMode ? lightTheme.colors : darkTheme.colors;
  const icon = lightMode ? lightTheme.icons : darkTheme.icons;

  const handlePress = async () => {
    if (mode === "signUp") {
      await signUp(email, password);
    }
    if (mode === "signIn") {
      await signIn(email, password);
    }
  };

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        backgroundColor: theme.white,
      }}
    >
      <Text
        style={{
          color: theme.foreground,
          fontSize: 24,
          marginBottom: 20,
        }}
      >
        welcome to Whatsapp
      </Text>
      <Image
        source={icon.welcome}
        style={{ width: 180, height: 180 }}
        resizeMode="cover"
      />
      <View
        style={{
          marginTop: 20,
        }}
      >
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          style={{
            borderBottomColor: theme.primary,
            borderBottomWidth: 2,
            width: 200,
          }}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry={true}
          style={{
            borderBottomColor: theme.primary,
            borderBottomWidth: 2,
            width: 200,
            marginTop: 20,
          }}
        />
        <View
          style={{
            marginTop: 20,
          }}
        >
          <Button
            disabled={!password || !email}
            onPress={handlePress}
            title={mode === "signUp" ? "sign Up" : "sign In"}
            color={theme.secondary}
          />
        </View>
        <TouchableOpacity
          style={{
            marginTop: 15,
            alignItems: "center",
          }}
          onPress={() =>
            mode === "signUp" ? setMode("signIn") : setMode("signUp")
          }
        >
          <Text
            style={{
              color: theme.secondaryText,
            }}
          >
            {mode === "signUp"
              ? "Already have an account? Sign in"
              : "Don't have an account? Sign Up"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignIn;
