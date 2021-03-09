import React from "react";
import { useEffect } from "react";
import firebase from "firebase/app";
import { auth, firestore } from "./firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";
import ChatMessage from "./ChatMessage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

export const ChatRoom = () => {
  const spanRef = React.useRef();
  const messagesReference = firestore.collection("messages");
  const query = messagesReference.orderBy("createdAt").limit(50);
  const [messages, isLoading, error] = useCollectionData(query, {
    idField: "id",
  });

  const [formValue, setFormValue] = React.useState("");

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
    await messagesReference.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      photoURL,
      uid,
    });

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
                {auth.currentUser && <Logout />}
              </p>
            </div>

            <div className="messages-box">
              <div className="list-group rounded-0">
                <a className="list-group-item list-group-item-action active text-white rounded-0">
                  <div className="media">
                    <img
                      src="https://res.cloudinary.com/mhmd/image/upload/v1564960395/avatar_usae7z.svg"
                      alt="user"
                      width="50"
                      className="rounded-circle"
                    />
                    <div className="media-body ml-4">
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <h6 className="mb-0">Jason Doe</h6>
                        <small className="small font-weight-bold">25 Dec</small>
                      </div>
                      <p className="font-italic mb-0 text-small">
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit, sed do eiusmod tempor incididunt ut labore.
                      </p>
                    </div>
                  </div>
                </a>

                <a
                  href="#"
                  className="list-group-item list-group-item-action list-group-item-light rounded-0"
                >
                  <div className="media">
                    <img
                      src="https://res.cloudinary.com/mhmd/image/upload/v1564960395/avatar_usae7z.svg"
                      alt="user"
                      width="50"
                      className="rounded-circle"
                    />
                    <div className="media-body ml-4">
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <h6 className="mb-0">Jason Doe</h6>
                        <small className="small font-weight-bold">14 Dec</small>
                      </div>
                      <p className="font-italic text-muted mb-0 text-small">
                        Lorem ipsum dolor sit amet, consectetur. incididunt ut
                        labore.
                      </p>
                    </div>
                  </div>
                </a>

                <a
                  href="#"
                  className="list-group-item list-group-item-action list-group-item-light rounded-0"
                >
                  <div className="media">
                    <img
                      src="https://res.cloudinary.com/mhmd/image/upload/v1564960395/avatar_usae7z.svg"
                      alt="user"
                      width="50"
                      className="rounded-circle"
                    />
                    <div className="media-body ml-4">
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <h6 className="mb-0">Jason Doe</h6>
                        <small className="small font-weight-bold">9 Nov</small>
                      </div>
                      <p className="font-italic text-muted mb-0 text-small">
                        consectetur adipisicing elit, sed do eiusmod tempor
                        incididunt ut labore.
                      </p>
                    </div>
                  </div>
                </a>

                <a
                  href="#"
                  className="list-group-item list-group-item-action list-group-item-light rounded-0"
                >
                  <div className="media">
                    <img
                      src="https://res.cloudinary.com/mhmd/image/upload/v1564960395/avatar_usae7z.svg"
                      alt="user"
                      width="50"
                      className="rounded-circle"
                    />
                    <div className="media-body ml-4">
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <h6 className="mb-0">Jason Doe</h6>
                        <small className="small font-weight-bold">18 Oct</small>
                      </div>
                      <p className="font-italic text-muted mb-0 text-small">
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit, sed do eiusmod tempor incididunt ut labore.
                      </p>
                    </div>
                  </div>
                </a>

                <a
                  href="#"
                  className="list-group-item list-group-item-action list-group-item-light rounded-0"
                >
                  <div className="media">
                    <img
                      src="https://res.cloudinary.com/mhmd/image/upload/v1564960395/avatar_usae7z.svg"
                      alt="user"
                      width="50"
                      className="rounded-circle"
                    />
                    <div className="media-body ml-4">
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <h6 className="mb-0">Jason Doe</h6>
                        <small className="small font-weight-bold">17 Oct</small>
                      </div>
                      <p className="font-italic text-muted mb-0 text-small">
                        consectetur adipisicing elit, sed do eiusmod tempor
                        incididunt ut labore.
                      </p>
                    </div>
                  </div>
                </a>

                <a
                  href="#"
                  className="list-group-item list-group-item-action list-group-item-light rounded-0"
                >
                  <div className="media">
                    <img
                      src="https://res.cloudinary.com/mhmd/image/upload/v1564960395/avatar_usae7z.svg"
                      alt="user"
                      width="50"
                      className="rounded-circle"
                    />
                    <div className="media-body ml-4">
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <h6 className="mb-0">Jason Doe</h6>
                        <small className="small font-weight-bold">2 Sep</small>
                      </div>
                      <p className="font-italic text-muted mb-0 text-small">
                        Quis nostrud exercitation ullamco laboris nisi ut
                        aliquip ex ea commodo consequat.
                      </p>
                    </div>
                  </div>
                </a>

                <a
                  href="#"
                  className="list-group-item list-group-item-action list-group-item-light rounded-0"
                >
                  <div className="media">
                    <img
                      src="https://res.cloudinary.com/mhmd/image/upload/v1564960395/avatar_usae7z.svg"
                      alt="user"
                      width="50"
                      className="rounded-circle"
                    />
                    <div className="media-body ml-4">
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <h6 className="mb-0">Jason Doe</h6>
                        <small className="small font-weight-bold">30 Aug</small>
                      </div>
                      <p className="font-italic text-muted mb-0 text-small">
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit, sed do eiusmod tempor incididunt ut labore.
                      </p>
                    </div>
                  </div>
                </a>

                <a
                  href="#"
                  className="list-group-item list-group-item-action list-group-item-light rounded-0"
                >
                  <div className="media">
                    <img
                      src="https://res.cloudinary.com/mhmd/image/upload/v1564960395/avatar_usae7z.svg"
                      alt="user"
                      width="50"
                      className="rounded-circle"
                    />
                    <div className="media-body ml-4">
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <h6 className="mb-0">Jason Doe</h6>
                        <small className="small font-weight-bold">21 Aug</small>
                      </div>
                      <p className="font-italic text-muted mb-0 text-small">
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit, sed do eiusmod tempor incididunt ut labore.
                      </p>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="col-7 px-0">
          <div className="px-4 py-5 chat-box bg-white">
            {messages &&
              messages.map((message) => {
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
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
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
