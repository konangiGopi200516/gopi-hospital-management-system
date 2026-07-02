import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBo0u96GbGZ_wW2SdaYLUo40hAO3q7YX2k",
  authDomain: "hospital-management-syst-d9f70.firebaseapp.com",
  databaseURL: "https://hospital-management-syst-d9f70-default-rtdb.firebaseio.com",
  projectId: "hospital-management-syst-d9f70",
  storageBucket: "hospital-management-syst-d9f70.firebasestorage.app",
  messagingSenderId: "1084923428120",
  appId: "1:1084923428120:web:aab9582f5b776b9774f26d",
  measurementId: "G-Q344JNJH47"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getDatabase(app);
