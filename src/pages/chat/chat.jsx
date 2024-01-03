import { useSelector } from "react-redux";
import ChatUserList from "./../../components/chat-user-list/chat-user-list";
import ChatWindow from "./../../components/chat-window/chat-window";
import { isMobile } from "react-device-detect";

function Chat() {
  const isShowChatWindowOnly = useSelector(
    (state) => state.chat.isShowChatWindowOnly
  );

  if (isMobile && isShowChatWindowOnly) {
    return <ChatWindow />;
  }

  if (isMobile) {
    return <ChatUserList />;
  }

  return (
    <>
      <ChatUserList />
      <ChatWindow />
    </>
  );
}

export default Chat;
