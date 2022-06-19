import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import "expo-random";
import { nanoid } from "nanoid";
import { storage } from "../firebase/firebase";

export const randId = (length) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const pickImage = async () => {
  let result = ImagePicker.launchCameraAsync();
  return result;
};

export const askForPermission = async () => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  return status;
};

export const uploadImage = async (uri, path, fName) => {
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
      resolve(xhr.response);
    };

    xhr.onerror = (e) => {
      console.log(e);
      reject(new TypeError("Network request failed"));
    };

    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });

  const fileName = fName || randId(25);
  const imageRef = ref(storage, `${path}/${fileName}.jpeg`);

  const snapShot = await uploadBytes(imageRef, blob, {
    contentType: "image/jpeg",
  });

  blob.close();

  const url = await getDownloadURL(snapShot.ref);

  return { url, fileName };
};
