import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  onSnapshot,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";
import getAnswer from "../../api/answer";
import db from "../../api/api";
import {
  setMessages,
  setShowChatWindowOnly,
  setCurrentUserId,
} from "../../store/chatSlice";
import ChatMessage from "../chat-message/chat-message";
import { convertTimestamp } from "../../util";
import { MobileView } from "react-device-detect";

function ChatWindow() {
  const dispatch = useDispatch();
  const messageRef = useRef();
  const activeUserId = useSelector((state) => state.chat.currentUserId);
  const isMobileView = useSelector((state) => state.chat.isMobileView);
  const users = useSelector((state) => state.chat.users);
  const messages = useSelector((state) => state.chat.messages).filter(
    (item) => item.uid === activeUserId
  );

  useEffect(() => {
    const collRef = collection(db, "messages");
    const orderedColl = query(collRef, orderBy("createdAt"));
    if (
      localStorage.getItem("avatar") &&
      localStorage.getItem("name") &&
      localStorage.getItem("email") !== null
    ) {
      onSnapshot(orderedColl, (querySnapshot) => {
        const messages = [];
        querySnapshot.forEach((doc) => {
          messages.push({
            ...doc.data(),
            id: doc.id,
            createdAt: convertTimestamp(doc.data().createdAt, "messageFormat"),
          });
        });
        dispatch(setMessages(messages));
      });
    }
  }, [dispatch, activeUserId]);

  const activeUser = users.find((item) => item.uid === activeUserId);

  const handleSendMessageClick = (value = null) => {
    const message = value ? messageRef.current.value : value;
    if (message && activeUserId) {
      const collMessagesRef = collection(db, "messages");
      const collUsersRef = doc(db, "users", activeUserId);

      updateDoc(collUsersRef, {
        lastMessage: message,
        lastMessageCreatedAt: serverTimestamp(),
      });
      addDoc(collMessagesRef, {
        text: message,
        avatar: activeUser.avatarUrl,
        name: activeUser.name,
        uid: activeUserId,
        createdAt: serverTimestamp(),
      });
      getAnswer(activeUserId);
      messageRef.current.value = "";
    }
  };

  const handleEnterKeyDown = (evt) => {
    if (evt.key === "Enter") {
      evt.preventDefault();
      handleSendMessageClick(evt.currentTarget.value);
    }
  };

  const handleMobileViewClick = () => {
    if (isMobileView) {
      dispatch(setShowChatWindowOnly(false));
    }
    dispatch(setCurrentUserId(""));
  };

  return (
    <div
      className="chat"
      style={isMobileView ? { width: "100vw" } : { width: "70vw" }}
    >
      <header className="chat__header">
        <MobileView style={{ marginTop: "5px", marginLeft: "10px" }}>
          <button
            className="chat__header-btn-back"
            onClick={handleMobileViewClick}
          />
        </MobileView>
        {activeUser && (
          <img
            className="chat__header-avatar author__avatar"
            src={activeUser.avatarUrl}
            alt="author"
            width="50"
            height="50"
          />
        )}
        <span className="chat__header-name">
          {activeUser && activeUser.name}
        </span>
      </header>
      <div className="chat__content-wrapper">
        {messages.map((item) => (
          <ChatMessage key={item.id} message={item} />
        ))}
      </div>
      {activeUser && (
        <footer className="chat__input-wrapper">
          <textarea
            ref={messageRef}
            onKeyDown={handleEnterKeyDown}
            className="chat__input"
            placeholder="Type your message and get joke about Chuck"
          />
          <img
            onClick={handleSendMessageClick}
            className="send-message-btn"
            src="images/send-icon.svg"
            alt="send message"
            width="35"
            height="35"
          />
        </footer>
      )}
    </div>
  );
}

export default ChatWindow;
