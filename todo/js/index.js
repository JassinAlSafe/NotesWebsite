import { db, auth } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

import {
  addDoc,
  collection,
  getDoc,
  getDocs,
  setDoc,
  where,
  query,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const registerButton = document.getElementById("registerButton");
const loginButton = document.getElementById("loginButton");
const container = document.getElementById("container");
const signUpButton = document.getElementById("signUpBtn");
const signInBtn = document.getElementById("signInBtn");

async function login() {
  const email = document.getElementById("emailLogin").value;
  const password = document.getElementById("passwordLogin").value;

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    window.location.href = "/note/note.html";
    console.log("Logged in as", userCredential.user.email);
  } catch (error) {
    console.error("Error", error);
  }
}

async function register(email, password) {
  const headerTitle = document.getElementById("headerTitle");
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    headerTitle.innerText = "Signup successful! Redirecting to login...";
    headerTitle.style.fontSize = "20px";

    setTimeout(() => {
      headerTitle.innerText = "Create Account";
      container.classList.remove("right-panel-active");
    }, 3000);

    await setDoc(doc(db, "users", userCredential.user.uid), {
      email: email,
    });
    console.log("User registered and data stored in Firebase");
  } catch (error) {
    console.error("Error", error);
    if (error.code === "auth/email-already-in-use") {
      alert("This email is already in use. Please use a different email.");
    } else {
      alert("An error occurred: " + error.message);
    }
  }
}

signUpButton.addEventListener("click", () => {
  container.classList.add("right-panel-active");
});

registerButton.addEventListener("click", () => {
  event.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  register(email, password);
});

signInBtn.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
});

loginButton.addEventListener("click", () => {
  event.preventDefault();
  login();
});

export { login, register };
