import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { initializeFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCExsBWvg_nUFLfGuQDYXBZ9K8KzE4my3o",
  authDomain: "whatsapp-26862.firebaseapp.com",
  projectId: "whatsapp-26862",
  storageBucket: "whatsapp-26862.appspot.com",
  messagingSenderId: "1031503878626",
  appId: "1:1031503878626:web:48a8313cefb26c682481bb",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});
