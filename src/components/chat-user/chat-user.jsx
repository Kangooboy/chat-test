import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import db from '../../api/api';
import { convertTimestamp } from '../../util';

function ChatUser({user, handleListItemClick, activeUserId}) {
  const [lastUserMessage, setLastUserMessage] = useState();
  const lastMessageDate = lastUserMessage ? lastUserMessage.createdAt : '';

  useEffect(() => {
    const collRef = collection(db, 'messages');
    const orderedColl = query(collRef, orderBy('createdAt'));
    onSnapshot(orderedColl, (querySnapshot) => {
      const messages = [];
      querySnapshot.forEach((doc) => {
        messages.push({...doc.data(), id: doc.id, createdAt: convertTimestamp(doc.data().createdAt, 'userFormat')});
      });
      const message = messages.filter((item) => item.uid === user.uid && item.name !== 'Chuck');

      setLastUserMessage(message.slice(-1)[0]);
    });
  }, [activeUserId, user.uid])

  return (
    <li onClick={handleListItemClick} data-id={user.uid}
      className={activeUserId === user.uid ? "chats__item chats__item--active" : "chats__item"} style={{cursor:'pointer'}}
    >
      <div className="chats__item-wrapper">
        <img className="author-avatar" src={user.avatarUrl} alt="author" width="50" height="50" />
        <div className="author">
          <span className="author__name">{user.name}</span>
          <p className="author__text">{lastUserMessage ? lastUserMessage.text : ''}</p>
        </div>
      </div>
      <time className="message-date" dateTime={lastMessageDate}>{lastMessageDate}</time>
    </li>
  )
}

export default ChatUser;
