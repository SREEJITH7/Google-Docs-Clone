// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBqlTis8fEt-ApmwV0gxa_ukX1njiyHLH4",
  authDomain: "docs-clone-50d87.firebaseapp.com",
  projectId: "docs-clone-50d87",
  storageBucket: "docs-clone-50d87.firebasestorage.app",
  messagingSenderId: "865857814431",
  appId: "1:865857814431:web:fa83f4a7b60c1b89c347aa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);