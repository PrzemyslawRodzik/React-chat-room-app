import logo from "./logo.svg";
import PwnedCheck from "./PwnedCheck";
import "./App.css";
import React from "react";
import { useEffect } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  useCollection,
  useCollectionData,
} from "react-firebase-hooks/firestore";

var firebaseConfig = {
  apiKey: "AIzaSyAxlW9mAiruXVAPOXYq6DdsPswGNY0mSjM",
  authDomain: "react-chat-passwordmanagerapp.firebaseapp.com",
  projectId: "react-chat-passwordmanagerapp",
  storageBucket: "react-chat-passwordmanagerapp.appspot.com",
  messagingSenderId: "238221925564",
  appId: "1:238221925564:web:39caac22f1a268168b04b9",
  measurementId: "G-E10FEQCMW4",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

const auth = firebase.auth();
const firestore = firebase.firestore();

const AppContext = React.createContext();

function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <PwnedCheck />
        {user ? <ChatRoom /> : <Login />}

        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

const ChatRoom = () => {
  const messagesReference = firestore.collection("messages");

  const query = messagesReference.orderBy("createdAt").limit(25);

  const [messages, isLoading, error] = useCollectionData(query, {
    idField: "id",
  });
  const [formValue, setFormValue] = React.useState("");

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    console.log(formValue);
    const { uid, photoURL } = auth.currentUser;
    await messagesReference.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      photoURL,
      uid,
    });

    setFormValue("");
  };

  return (
    <>
      <div>
        {auth.currentUser && <Logout />}
        {messages &&
          messages.map((message) => {
            return (
              <div key={message.id}>
                {message.text} created at:{" "}
                {message.createdAt?.toDate().toLocaleString()}
              </div>
            );
          })}

        <form>
          <input
            type="text"
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
          />

          <button type="button" onClick={handleMessageSubmit}>
            Send
          </button>
        </form>
      </div>
    </>
  );
};

const Logout = () => {
  function signOutWithGoogle() {
    auth
      .signOut()
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
      });
  }

  return (
    <>
      <button type="button" onClick={() => signOutWithGoogle()}>
        Logout
      </button>
    </>
  );
};

const Login = () => {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
        var credential = result.credential;

        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        console.log(
          "credentials: " + credential + "token: " + token + " user: " + user
        );
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
  };

  return (
    <button type="button" onClick={() => signInWithGoogle()}>
      Sign In
    </button>
  );
};

export default App;
