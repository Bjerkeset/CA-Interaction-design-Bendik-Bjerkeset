// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyApMRKHWQLeU9Bj2IjyjG5xe1i2w1X2mUA",
  authDomain: "utility-token-system.firebaseapp.com",
  projectId: "utility-token-system",
  storageBucket: "utility-token-system.appspot.com",
  messagingSenderId: "833051955393",
  appId: "1:833051955393:web:b53418919c6c47071b0440"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };