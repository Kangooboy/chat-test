import { useState } from 'react';
import { useSelector } from 'react-redux';
import {  deleteDoc, doc  } from 'firebase/firestore';
import db from '../../api/api';

function ChatMessage({message}) {
  const [isMouseOver, setIsMouseOver] = useState(false);
  const isMobileView = useSelector((state) => state.chat.isMobileView);

  const handleMessageMouseOver = () => setIsMouseOver(true);
  const handleMessageMouseLeave = () => setIsMouseOver(false);

  const handleDeleteMessageClick = () => deleteDoc(doc(db, 'messages', message.id));

  return (
    <div className={message.name === 'Chuck' ? "chat__item chat__item--answer" : "chat__item"}
      onMouseOver={handleMessageMouseOver} onMouseLeave={handleMessageMouseLeave}>
      <img className="author-avatar" src={message.avatar} alt="author" width="50" height="50" />
      <div className="chat__item-content">
        <p className={message.name === 'Chuck' ? "chat__item-text chat__item-text--answer" : "chat__item-text"}>{message.text}</p>
        <time className="review__date" dateTime={message.createdAt}>{message.createdAt}</time>
        {isMobileView && <span className="delete-message-btn" onClick={handleDeleteMessageClick}>X</span>}
        {isMouseOver && !isMobileView ?
          <span className="delete-message-btn" onClick={handleDeleteMessageClick}>X</span>
          :
          ''
        }
      </div>
    </div>
  );
}

export default ChatMessage;
