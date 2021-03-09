import React from "react";
import { dphotoURL } from "./assets/img/defaultAvatar";
import { auth, firestore } from "./firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const ChatMessage = ({ id, text, uid, photoURL, createdAt }) => {
  const messageclass =
    uid === auth.currentUser.uid ? "myMessage" : "notMyMessage";
  const time = createdAt?.toDate().toLocaleTimeString();

  const deleteMessage = (id) => {
    firestore
      .collection("messages")
      .doc(id)
      .delete()
      .then(() => {
        console.log("Document successfully deleted!");
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  };

  if (messageclass === "myMessage") {
    return (
      <div className="media w-50 ml-auto mb-3">
        <div className="media-body divMessage">
          <div className="bg-primary rounded py-2 px-3 mb-2">
            <p className="text-small mb-0 text-white">{text}</p>
            <div className="thrashClass">
              <FontAwesomeIcon
                icon={faTrashAlt}
                onClick={() => {
                  deleteMessage(id);
                }}
                className="thrashIcon"
              />
            </div>
          </div>
          <p className="small text-muted">
            {time + " | " + createdAt?.toDate().toDateString()}
          </p>
        </div>
      </div>
    );
  } else if (messageclass === "notMyMessage") {
    return (
      <div className="media w-50 mb-3">
        <img
          src={photoURL || dphotoURL}
          alt="user"
          width="50"
          className="rounded-circle"
        />
        <div className="media-body ml-3">
          <div className="bg-light rounded py-2 px-3 mb-2">
            <p className="text-small mb-0 text-muted">{text}</p>
          </div>
          <p className="small text-muted">
            {time + " | " + createdAt?.toDate().toDateString()}
          </p>
        </div>
      </div>
    );
  }
};

export default ChatMessage;
