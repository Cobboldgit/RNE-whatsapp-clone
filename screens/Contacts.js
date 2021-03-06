import { View, Text, FlatList } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import useContacts from "../hooks/useHooks";
import GlobalContext from "../context/Context";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";
import ListItems from "../components/ListItems";
import { useRoute } from "@react-navigation/native";

const Contacts = () => {
  const contacts = useContacts();
  const route = useRoute();
  const image = route.params && route.params.image;
  return (
    <FlatList
      data={contacts}
      keyExtractor={(_, i) => i}
      renderItem={({ item }) => <ContactPreview contact={item} image={image} />}
      style={{
        flex: 1,
        padding: 10,
      }}
    />
  );
};

const ContactPreview = ({ contact, image }) => {
  const { unfilteredRooms, rooms } = useContext(GlobalContext);
  const [user, setUser] = useState(contact);

  useEffect(() => console.log(unfilteredRooms), [unfilteredRooms]);

  useEffect(() => {
    const q = query(
      collection(db, "users"),
      where("email", "==", contact?.email)
    );
    const unsubscribe = onSnapshot(
      q,
      (snapShot) => {
        if (snapShot.docs.length) {
          const userDoc = snapShot.docs[0].data();
          setUser((prevUser) => ({ ...prevUser, userDoc }));
        }
      },
      (error) => {
        console.log(error);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <ListItems
      style={{ marginTop: 7 }}
      type="contacts"
      user={user}
      image={image}
      room={unfilteredRooms.find((room) =>
        room?.participantsArray.includes(contact?.email)
      )}
    />
  );
};

export default Contacts;
