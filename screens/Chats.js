// @refresh reset

import { View, Text } from "react-native";
import React, { useContext, useEffect } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import GlobalContext from "../context/Context";
import ContactsFloatingIcon from "../components/ContactsFloatingIcon";
import ListItems from "../components/ListItems";
import useContacts from "../hooks/useHooks";
import { logOut } from "../firebase/actions";

const Chats = () => {
  const { currentUser } = auth;
  const { rooms, setRooms, setUnfilteredRooms } = useContext(GlobalContext);
  const contacts = useContacts();

  const chatsQuery = query(
    collection(db, "rooms"),
    where("participantsArray", "array-contains", currentUser?.email)
  );

  useEffect(() => {
    const unsubscribe = onSnapshot(chatsQuery, (querySnapshot) => {
      const parsedChats = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        userB: doc
          .data()
          .participants.find((p) => p.email != currentUser.email),
      }));
      setUnfilteredRooms(parsedChats);
      setRooms(parsedChats.filter((doc) => doc.lastMessage));
    });

    return () => unsubscribe();
  }, []);

  const getUserB = (user, contacts) => {

    const userContact = contacts.find((c) => c?.email === user?.email);
    if (userContact && userContact?.contactName) {
      return { ...user, contactName: userContact?.contactName };
    }
  };
  // logOut()

  return (
    <View
      style={{
        flex: 1,
        padding: 5,
        paddingRight: 10,
      }}
    >
      {rooms.map((room) => (
        <ListItems
          key={room.id}
          user={getUserB(room.userB, contacts)}
          type="chat"
          description={room.lastMessage.text}
          room={room}
          time={room.lastMessage.createdAt}
        />
      ))}
      <ContactsFloatingIcon />
    </View>
  );
};

export default Chats;
