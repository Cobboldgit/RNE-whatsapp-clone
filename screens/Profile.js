import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Button,
} from "react-native";
import React, { Fragment, useContext, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";
import GlobalContext from "../context/Context";
import { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  pickImage,
  askForPermission,
  uploadImage,
} from "../actions/appActions";
import { auth, db } from "../firebase/firebase";
import { updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

const Profile = () => {
  const [displayName, setDisplayName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState(null);

  const {navigate} = useNavigation()

  const {
    theme: { lightTheme, darkTheme },
    lightMode,
  } = useContext(GlobalContext);

  const theme = lightMode ? lightTheme.colors : darkTheme.colors;
  const icon = lightMode ? lightTheme.icons : darkTheme.icons;

  useEffect(() => {
    (async () => {
      const status = await askForPermission();
      setPermissionStatus(status);
    })();
  }, []);

  const handlePress = async () => {
    const user = auth.currentUser;
    let photoURL;

    if (selectedImage) {
      const { url } = await uploadImage(
        selectedImage,
        `images/${user?.uid}`,
        "profilePicture"
      );
      photoURL = url;
    }

    const userData = {
      displayName,
      email: user?.email,
    };

    if (photoURL) {
      userData.photoURL = photoURL;
    }

    await Promise.all([
      updateProfile(user, userData),
      setDoc(doc(db, "users", user?.uid), { ...userData, uid: user?.uid }),
    ])

    navigate('home')
  };

  const handleProfilePicture = async () => {
    const result = await pickImage();
    if (!result.cancelled) {
      setSelectedImage(result.uri);
    }
  };

  if (!permissionStatus) {
    return <Text>Loading...</Text>;
  }
  if (permissionStatus != "granted") {
    return <Text>You need allow this permission</Text>;
  }

  return (
    <Fragment>
      <StatusBar style="auto" />
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          paddingTop: Constants.statusBarHeight + 20,
          padding: 20,
        }}
      >
        <Text
          style={{
            fontSize: 22,
            color: theme.foreground,
          }}
        >
          Profile Info
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: theme.text,
            marginTop: 20,
          }}
        >
          Please provide your name and a profile image
        </Text>
        <TouchableOpacity
          onPress={handleProfilePicture}
          style={{
            marginTop: 30,
            borderRadius: 120,
            width: 120,
            height: 120,
            backgroundColor: theme.background,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {!selectedImage ? (
            <MaterialCommunityIcons
              name="camera-plus"
              color={theme.iconGray}
              size={45}
            />
          ) : (
            <Image
              source={{ uri: selectedImage }}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 120,
              }}
            />
          )}
        </TouchableOpacity>
        <TextInput
          placeholder="Type your name"
          value={displayName}
          onChangeText={setDisplayName}
          style={{
            borderBottomColor: theme.primary,
            marginTop: 40,
            borderBottomWidth: 2,
            width: "100%",
          }}
        />
        <View
          style={{
            marginTop: "auto",
            width: 80,
          }}
        >
          <Button
            title="Next"
            color={theme.secondary}
            onPress={handlePress}
            disabled={!displayName}
          />
        </View>
      </View>
    </Fragment>
  );
};

export default Profile;
