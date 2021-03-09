import "./chat.css";
import React from "react";
import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { ChatRoom, Login } from "./ChatRoom";
import { Logout } from "./ChatRoom";

function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="container py-5 px-4">
      <header className="text-center">
        <h1 className="display-4 text-white">Chat room </h1>
        <p className="text-white lead mb-0"></p>
        <p className="text-white lead mb-4">
          Snippet by
          <a href="https://bootstrapious.com" className="text-white">
            <u> Bootstrapious</u>
          </a>
        </p>
      </header>

      <div className="row rounded-lg overflow-hidden shadow chatRoomDiv">
        {user ? <ChatRoom /> : <Login />}
      </div>
    </div>
  );
}

export default App;
