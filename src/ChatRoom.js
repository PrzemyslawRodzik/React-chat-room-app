import React from "react";
import { useEffect, useLayoutEffect } from "react";
import firebase from "firebase/app";
import { auth, firestore } from "./firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";
import ChatMessage from "./ChatMessage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";
import UserPanel from "./UserPanel";

export const ChatRoom = () => {
  const spanRef = React.useRef();

  const messagesReference = firestore.collection("messages");
  const usersReference = firestore.collection("users");
  const queryMessages = messagesReference.orderBy("createdAt");

  const queryUsers = usersReference.where("uid", "!=", auth.currentUser.uid);

  const [query, setQuery] = React.useState(queryMessages);
  const [messages, isLoading, isMessagesError] = useCollectionData(query, {
    idField: "id",
  });
  const [users, isUsersLoading, isUsersError] = useCollectionData(queryUsers, {
    idField: "id",
  });

  const [formValue, setFormValue] = React.useState("");
  const [chatRoomType, setChatRoomType] = React.useState("public");

  const setRoomType = (uid = "public") => {
    setChatRoomType(uid);
  };

  function updateScroll() {
    spanRef.current.scrollIntoView({ behavior: "smooth" });
  }
  useEffect(() => {
    if (!isLoading) {
      updateScroll();
    }
  });
  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    if (!formValue) {
      return;
    }
    const { uid, photoURL } = auth.currentUser;

    if (chatRoomType === "public") {
      await messagesReference.add({
        text: formValue,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        photoURL,
        type: "public",
        uid,
      });
    } else {
      let sentTo = chatRoomType;
      await messagesReference.add({
        text: formValue,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        photoURL,
        sentTo,
        uid,
      });
    }

    setFormValue("");
    updateScroll();
  };
  const handleEnterClicked = (event) => {
    if (event.keyCode === 13) {
      handleMessageSubmit(event);
    }
  };

  if (isLoading) {
    return <div className="loadingDiv">Loading ...</div>;
  } else if (!isLoading) {
    return (
      <>
        <div className="col-5 px-0">
          <div className="bg-white">
            <div className="bg-gray px-4 py-2 bg-light">
              <p className="h5 mb-0 py-1">Recent</p>
            </div>

            <div className="d-flex align-items-center justify-content-between mb-1">
              <h6 className="mb-0"></h6>

              <p className="h5 ml-10 py-1 logoutClass">
                <button
                  className="wallbtn"
                  type="button"
                  onClick={() => setRoomType()}
                >
                  Wall
                </button>{" "}
                | {auth.currentUser && <Logout />}
              </p>
            </div>

            <div className="messages-box">
              <div className="list-group rounded-0">
                {users &&
                  users.map((x) => {
                    return (
                      <UserPanel
                        key={x.uid}
                        user={x}
                        setRoomType={setRoomType}
                        authUser={auth.currentUser}
                        messages={messages}
                      />
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
        <div className="col-7 px-0">
          <div className="roomIndicator">
            {chatRoomType === "public" ? "Wall" : ""}
          </div>
          <div className="px-4 py-5 chat-box bg-white">
            {chatRoomType === "public"
              ? messages &&
                messages
                  .filter((x) => x.type === "public")
                  .map((message) => {
                    return <ChatMessage key={message.id} {...message} />;
                  })
              : messages &&
                messages
                  .filter(
                    (x) =>
                      (x.sentTo === chatRoomType &&
                        x.uid === auth.currentUser.uid) ||
                      (x.sentTo === auth.currentUser.uid &&
                        x.uid === chatRoomType)
                  )
                  .map((message) => {
                    return <ChatMessage key={message.id} {...message} />;
                  })}
            <span id="spanScroll" ref={spanRef}></span>
          </div>

          <form className="bg-light">
            <div className="input-group">
              <input
                type="text"
                placeholder="Type a message"
                aria-describedby="button-addon2"
                className="form-control rounded-0 border-0 py-4 bg-light"
                value={formValue}
                onChange={(e) => setFormValue(e.target.value)}
                onKeyDown={(e) => handleEnterClicked(e)}
              />
              <div className="input-group-append">
                <button
                  id="button-addon2"
                  type="button"
                  className="btn btn-link"
                  onClick={handleMessageSubmit}
                >
                  <FontAwesomeIcon icon={faPaperPlane} />
                </button>
              </div>
            </div>
          </form>
        </div>
      </>
    );
  }
};

export const Logout = () => {
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
      <FontAwesomeIcon
        icon={faSignOutAlt}
        onClick={() => signOutWithGoogle()}
      />
    </>
  );
};

export const Login = () => {
  const addUser = (userAuth) => {
    const { email, displayName, photoURL, uid } = userAuth;

    firestore
      .collection("users")
      .where("uid", "==", uid)
      .limit("1")
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.empty) {
          console.log("No such document!");

          firestore.collection("users").add({
            email,
            displayName,
            photoURL,
            uid,
          });
        } else {
          querySnapshot.forEach((doc) => {
            if (doc.exists) {
              if (!_.isEqual(userAuth, doc.data())) {
                firestore.collection("users").doc(doc.id).update({
                  email,
                  displayName,
                  photoURL,
                  uid,
                });
              }
            }
          });
        }
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  };

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        addUser(result.user);
      });
  };

  return (
    <button
      type="button"
      className="loginBtn"
      onClick={() => signInWithGoogle()}
    >
      Sign In
    </button>
  );
};
