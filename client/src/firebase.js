import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blog-d5eb3.firebaseapp.com",
  projectId: "blog-d5eb3",
  storageBucket: "blog-d5eb3.appspot.com",
  messagingSenderId: "976950960820",
  appId: "1:976950960820:web:a0b0ba71c3fbe4f3f7ede1"
};

export const app = initializeApp(firebaseConfig);