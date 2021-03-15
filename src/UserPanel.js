import React, { useLayoutEffect } from "react";
import { formattedCreatedAt } from "./utils";

const UserPanel = ({ user, messages, setRoomType, authUser }) => {
  const openChatRoom = (userUid) => {
    setRoomType(userUid);
  };

  const panelbtnRef = React.useRef();
  const usersPanel = React.useRef();

  const setActivePanelBtn = () => {
    // Get the container element
    var btnContainer = usersPanel.current;
    //console.log(btnContainer);
    // Get all buttons with class="btn" inside the container
    var btns = btnContainer.getElementsByClassName(
      "list-group-item list-group-item-action text-black rounded-0"
    );
    // console.log(btns);
    // Loop through the buttons and add the active class to the current/clicked button
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", function () {
        var current = document.getElementsByClassName("active");
        console.log(current + " asdasd");

        // If there's no active class
        if (current.length > 0) {
          current[0].className = current[0].className.replace(" active", "");
        }

        // Add the active class to the current/clicked button
        this.className += " active";
      });
    }
  };
  useLayoutEffect(() => {
    setActivePanelBtn();
    return () => {};
  }, []);
  const getLastMessage = () => {
    var filteredMessages = messages.filter(
      (x) =>
        (x.sentTo === user.uid && x.uid === authUser.uid) ||
        (x.sentTo === authUser.uid && x.uid === user.uid)
    );
    return filteredMessages[filteredMessages.length - 1];
  };
  function setUserPanelEffect(e) {
    var elems = document.querySelectorAll(".active");
    [].forEach.call(elems, function (el) {
      el.classList.remove("active");
    });
    e.target.className = "active";
  }
  return (
    <div id="usersPanel" ref={usersPanel}>
      <button
        type="button"
        className="list-group-item list-group-item-action text-black rounded-0"
        ref={panelbtnRef}
        onClick={() => openChatRoom(user.uid)}
      >
        <div className="media">
          <img
            src={user.photoURL}
            alt="user"
            width="50"
            className="rounded-circle"
          />
          <div className="media-body ml-4">
            <div className="d-flex align-items-center justify-content-between mb-1">
              <h6 className="mb-0">{user.displayName}</h6>
              <small className="small dateUserPanel">
                {formattedCreatedAt(getLastMessage()?.createdAt) || ""}
              </small>
            </div>
            <p className="font-italic mb-0 text-small">
              Last message: <br />
              {getLastMessage()?.text || "No messages"}
            </p>
          </div>
        </div>
      </button>
    </div>
  );
};

export default UserPanel;
