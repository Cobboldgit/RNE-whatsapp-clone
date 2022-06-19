// @refresh reset
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase";
import { useRoute } from "@react-navigation/native";
import GlobalContext from "../context/Context";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { pickImage, randId, uploadImage } from "../actions/appActions";
import {
  GiftedChat,
  Actions,
  InputToolbar,
  Bubble,
} from "react-native-gifted-chat";
import { Ionicons } from "@expo/vector-icons";
import ImageView from "react-native-image-viewing";

const randomId = randId(25);

const Chat = () => {
  const [roomHash, setRoomHash] = useState("");
  const [messages, setMessages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageView, setSelectedImageView] = useState("");

  const {
    theme: { lightTheme, darkTheme },
    lightMode,
  } = useContext(GlobalContext);
  const theme = lightMode ? lightTheme.colors : darkTheme.colors;
  const icon = lightMode ? lightTheme.icons : darkTheme.icons;

  const { currentUser } = auth;
  const route = useRoute().params;
  const room = route.room;
  const selectedImage = route.image;
  const userB = route.user;

  const senderUser = currentUser.photoURL
    ? {
        name: currentUser.displayName,
        _id: currentUser.uid,
        avatar: currentUser.photoURL,
      }
    : { name: currentUser.displayName, _id: currentUser.uid };

  const roomId = room ? room.id : randomId;
  const roomRef = doc(db, "rooms", roomId);
  const roomMessagesRef = collection(db, "rooms", roomId, "messages");

  useEffect(() => {
    (async () => {
      if (!room) {
        const currUserData = {
          displayName: currentUser.displayName,
          email: currentUser.email,
        };
        if (currentUser.photoURL) {
          currUserData.photoURL = currentUser.photoURL;
        }
        const userBData = {
          displayName: userB.contactName || userB.displayName || "",
          email: userB.email,
        };
        if (userB.photoURL) {
          userBData.photoURL = userB.photoURL;
        }
        const roomData = {
          participants: [currUserData, userBData],
          participantsArray: [currentUser.email, userB.email],
        };
        try {
          await setDoc(roomRef, roomData);
        } catch (error) {
          console.log(error);
        }
      }
      const emailHash = `${currentUser.email}:${userB.email}`;
      setRoomHash(emailHash);
      if (selectedImage) {
        await sendImage(selectedImage.uri, emailHash);
      }
    })();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(roomMessagesRef, (querySnapshot) => {
      const messagesFirestore = querySnapshot
        .docChanges()
        .filter(({ type }) => type === "added")
        .map((doc) => {
          const message = doc.doc.data();

          return { ...message, createdAt: message.createdAt.toDate() };
        })
        .sort((a, b) => b.createdAt - a.createdAt);
      appendMessages(messagesFirestore);
    });

    return () => unsubscribe();
  }, []);

  const appendMessages = useCallback(
    (messages) => {
      setMessages((previousMessages) => {
        return GiftedChat.append(previousMessages, messages);
      });
    },
    [messages]
  );

  const onSend = async (messages = []) => {
    const writes = messages.map((m) => addDoc(roomMessagesRef, m));
    const lastMessage = messages[messages.length - 1];
    writes.push(updateDoc(roomRef, { lastMessage }));
    await Promise.all(writes);
  };

  const handlePhotoPicker = async () => {
    const result = await pickImage();
    if (!result.cancelled) {
      await sendImage(result.uri);
    }
  };

  const sendImage = async (uri, roomPath) => {
    const { url, fileName } = await uploadImage(
      uri,
      `images/rooms/${roomId || roomHash}`
    );
    const message = {
      _id: fileName,
      text: "",
      createdAt: new Date(),
      user: senderUser,
      image: url,
    };

    const lastMessage = { ...message, text: "image" };
    await Promise.all([
      addDoc(roomMessagesRef, message),
      updateDoc(roomRef, { lastMessage }),
    ]);
  };

  return (
    <ImageBackground
      resizeMode="cover"
      source={icon.chatBg}
      style={{
        flex: 1,
      }}
    >
      <GiftedChat
        onSend={onSend}
        messages={messages}
        user={senderUser}
        renderAvatar={null}
        renderActions={(props) => {
          return (
            <Actions
              {...props}
              containerStyle={{
                position: "absolute",
                right: 50,
                bottom: 5,
                zIndex: 9999,
              }}
              onPressActionButton={handlePhotoPicker}
              icon={() => (
                <Ionicons name="camera" size={30} color={theme.iconGray} />
              )}
            />
          );
        }}
        timeTextStyle={{
          right: {
            color: theme.iconGray,
          },
        }}
        renderSend={(props) => {
          const { text, messageIdGenerator, user, onSend } = props;
          return (
            <TouchableOpacity
              onPress={() => {
                if (text && onSend) {
                  onSend({
                    text: text.trim(),
                    user,
                    _id: messageIdGenerator(),
                  }, true);
                }
              }}
              style={{
                height: 40,
                width: 40,
                borderRadius: 40,
                backgroundColor: theme.primary,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 5,
              }}
            >
              <Ionicons name="send" size={20} color={theme.white} />
            </TouchableOpacity>
          );
        }}
        renderInputToolbar={(props) => {
          return (
            <InputToolbar
              {...props}
              containerStyle={{
                marginLeft: 10,
                marginRight: 10,
                marginBottom: 5,
                borderRadius: 20,
                paddingTop: 5,
                borderTopWidth: 0,
              }}
            />
          );
        }}
        renderBubble={(props) => {
          return (
            <Bubble
              {...props}
              textStyle={{
                right: {
                  color: theme.text,
                },
              }}
              wrapperStyle={{
                left: {
                  backgroundColor: theme.white,
                },
                right: {
                  backgroundColor: theme.tertiary,
                },
              }}
            />
          );
        }}
        renderMessageImage={(props) => {
          return (
            <View
              style={{
                borderRadius: 15,
                padding: 2,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(true);
                  setSelectedImageView(props.currentMessage.image);
                }}
              >
                <Image
                  source={{ uri: props.currentMessage.image }}
                  resizeMode="contain"
                  style={{
                    width: 200,
                    height: 200,
                    borderRadius: 15,
                    padding: 6,
                    resizeMode: "cover",
                  }}
                />
                {selectedImageView ? (
                  <ImageView
                    images={[{ uri: selectedImageView }]}
                    imageIndex={0}
                    visible={modalVisible}
                    onRequestClose={() => {
                      setModalVisible(false);
                    }}
                  />
                ) : null}
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </ImageBackground>
  );
};

export default Chat;
