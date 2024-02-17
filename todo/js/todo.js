import { db, auth } from "./firebase.js";
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

const form = document.querySelector(".form");
const input = document.querySelector(".form_input");
const todoList = document.querySelector(".toDoList");
const signOutButton = document.querySelector("#buttonSignout");

auth.onAuthStateChanged((user) => {
  if (user) {
    fetchTodosForUser(user.uid); 
  } else {
   
  }
});

function addItemToDom(itemId, toDoItemContent) {
  const li = document.createElement("li");
  const label = document.createElement("label");
  const input = document.createElement("input");
  const span = document.createElement("span");

  const deleteBtn = document.createElement("button");
  const editBtn = document.createElement("button");

  li.setAttribute("data-id", itemId);
  input.setAttribute("type", "checkbox");

  deleteBtn.textContent = "Delete";
  editBtn.textContent = "Edit";
  span.textContent = toDoItemContent;

  deleteBtn.classList.add("delete-btn");
  editBtn.classList.add("edit-btn");

  deleteBtn.addEventListener("click", () => {
    removeTodoFromFirestore(itemId);
    removeItemFromDOM(itemId);
  });

  editBtn.addEventListener("click", () => {
      const input = document.createElement("input");
      input.type = "text";
      input.value = span.textContent;
      label.replaceChild(input, span);

      input.addEventListener("blur", async () => {
        const newText = input.value;
        span.textContent = newText;
        label.replaceChild(span, input);

        await updateDoc(doc(db, "todos", itemId), {
          content: newText
        });
      });

      input.focus();
  });
 
  li.appendChild(deleteBtn);
  li.appendChild(editBtn);
  label.appendChild(input);
  label.appendChild(span);
  li.appendChild(label);

  todoList.appendChild(li);
}

async function fetchTodosForUser(userId) {
  const q = query(collection(db, "todos"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    addItemToDom(doc.id, doc.data().content);
  });
}

async function addTodoToFirestore(toDoItem) {
  if (!auth.currentUser) {
    console.error("No authenticated user found");
    return;
  }

  try {
    const newTodo = {
      content: toDoItem,
      completed: false,
      createdAt: serverTimestamp(), // If you want to record the creation time
      userId: auth.currentUser.uid, // Automatically set the userId to the current user's UID
    };

    const docRef = await addDoc(collection(db, "todos"), newTodo);
    addItemToDom(docRef.id, toDoItem);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
}

async function removeTodoFromFirestore(todoId) {
  try {
    await deleteDoc(doc(db, "todos", todoId));
  } catch (error) {
    console.error("Error removing document ", error);
  }
}

async function removeItemFromDOM(todoId) {
  const itemToRemove = document.querySelector(`[data-id='${todoId}']`);
  if (itemToRemove) {
    itemToRemove.remove();
  }
}

async function signOutUser() {
  try {
    await auth.signOut();
    window.location.href = "/index.html";
  } catch (error) {
    console.error("Error Signing Out: ", error);
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let toDoItem = input.value;
  if (toDoItem.trim() !== "") {
    addTodoToFirestore(toDoItem);
    input.value = "";
  }
});

todoList.addEventListener("click", async (e) => {
  let id = e.target.getAttribute("data-id");
  if (!id) return;

  try {
    await removeTodoFromFirestore(id);
    removeItemFromDOM(id);
  } catch (error) {
    console.error("Error in removing todo: ", error);
  }
});

signOutButton.addEventListener("click", signOutUser);

export { addTodoToFirestore, removeTodoFromFirestore };
