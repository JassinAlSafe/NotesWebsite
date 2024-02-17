import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDnvFvbKOBWBR3yy1blPnf951z5JO3S1jQ",
  authDomain: "todo-app-da02d.firebaseapp.com",
  projectId: "todo-app-da02d",
  storageBucket: "todo-app-da02d.appspot.com",
  messagingSenderId: "422484720610",
  appId: "1:422484720610:web:951db22380940e1f5117bb",
  measurementId: "G-78TLRXZ2GW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);



export { db, auth };
