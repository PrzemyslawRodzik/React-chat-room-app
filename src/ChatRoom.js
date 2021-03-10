import React from "react";
import { useEffect } from "react";
import firebase from "firebase/app";
import { auth, firestore } from "./firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";
import ChatMessage from "./ChatMessage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

export const ChatRoom = (sentTo) => {
  const spanRef = React.useRef();
  const messagesReference = firestore.collection("messages");
  const usersReference = firestore.collection("users");
  const publicQueryMessages = messagesReference.orderBy("createdAt");

  const queryUsers = usersReference
    .where("uid", "!=", auth.currentUser.uid)
    .limit(5);

  const [query, setQuery] = React.useState(publicQueryMessages);
  const [messages, isLoading, isMessagesError] = useCollectionData(query, {
    idField: "id",
  });
  const [users, isUsersLoading, isUsersError] = useCollectionData(queryUsers, {
    idField: "id",
  });

  const [formValue, setFormValue] = React.useState("");
  const [chatRoomType, setChatRoomType] = React.useState("");

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
    if (chatRoomType !== "public") {
      let sentTo = chatRoomType;
      await messagesReference.add({
        text: formValue,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        photoURL,
        sentTo,
        uid,
      });
    } else {
      await messagesReference.add({
        text: formValue,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        photoURL,
        type: "public",
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

  const openChatRoom = (uid) => {
    setChatRoomType(uid);
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
                {auth.currentUser && <Logout />}
              </p>
            </div>

            <div className="messages-box">
              <div className="list-group rounded-0">
                {users &&
                  users.map((x) => {
                    return (
                      <a
                        key={x.id}
                        className="list-group-item list-group-item-action activ text-black rounded-0"
                        onClick={() => openChatRoom(x.uid)}
                      >
                        <div className="media">
                          <img
                            src={x.photoURL}
                            alt="user"
                            width="50"
                            className="rounded-circle"
                          />
                          <div className="media-body ml-4">
                            <div className="d-flex align-items-center justify-content-between mb-1">
                              <h6 className="mb-0">{x.displayName}</h6>
                              <small className="small font-weight-bold">
                                25 Dec
                              </small>
                            </div>
                            <p className="font-italic mb-0 text-small">
                              Lorem ipsum dolor sit amet, consectetur
                              adipisicing elit, sed do eiusmod tempor incididunt
                              ut labore.
                            </p>
                          </div>
                        </div>
                      </a>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
        <div className="col-7 px-0">
          <div className="px-4 py-5 chat-box bg-white">
            {console.log(chatRoomType)}
            {chatRoomType === ""
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
              // doc.data() is never undefined for query doc snapshots
              // console.log(doc.id, " => ", doc.data());
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
