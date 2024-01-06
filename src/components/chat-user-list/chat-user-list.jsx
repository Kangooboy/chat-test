import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { onSnapshot, collection, orderBy, query } from "firebase/firestore";
import {
  getAuth,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import {
  setUsers,
  setCurrentUserId,
  setShowChatWindowOnly,
} from "../../store/chatSlice";
import db from "../../api/api";
import ChatUser from "../chat-user/chat-user";
import { convertTimestamp } from "../../util";

function ChatsUserList() {
  const dispatch = useDispatch();
  const searchRef = useRef();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isAuth, setIsAuth] = useState(false);
  const users = useSelector((state) => state.chat.users);
  const isMobileView = useSelector((state) => state.chat.isMobileView);
  const activeUserId = useSelector((state) => state.chat.currentUserId);

  useEffect(() => {
    const collRef = collection(db, "users");
    const orderedColl = query(collRef, orderBy("lastMessageCreatedAt", "desc"));
    if (
      localStorage.getItem("avatar") &&
      localStorage.getItem("name") &&
      localStorage.getItem("email") !== null
    ) {
      onSnapshot(orderedColl, (querySnapshot) => {
        const usersRef = [];
        querySnapshot.forEach((doc) => {
          usersRef.push({
            ...doc.data(),
            uid: doc.id,
            lastMessageCreatedAt: convertTimestamp(
              doc.data().lastMessageCreatedAt,
              "userFormat"
            ),
          });
        });
        setFilteredUsers(usersRef);
        dispatch(setUsers(usersRef));
      });
    }
  }, [dispatch]);

  const handleListItemClick = (evt) => {
    if (isMobileView) {
      dispatch(setShowChatWindowOnly(true));
    }
    dispatch(setCurrentUserId(evt.currentTarget.dataset.id));
  };

  useEffect(() => {
    onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        const name = user.displayName;
        const email = user.email;
        const avatar = user.photoURL;
        localStorage.setItem("name", name);
        localStorage.setItem("email", email);
        localStorage.setItem("avatar", avatar);
        setIsAuth(true);
      } else {
        setIsAuth(false);
      }
    });
  }, []);

  const handleSearchChange = (evt) => {
    if (evt.target.value) {
      const searchString = evt.target.value.toLowerCase();
      const filteredUsers = [];
      for (let i = 0; i <= searchString.length; i++) {
        users.forEach((item) => {
          if (searchString === item.name.slice(0, i).toLowerCase()) {
            filteredUsers.push(item);
          }
        });
      }
      setFilteredUsers(filteredUsers);
    } else {
      dispatch(setUsers(users));
      setFilteredUsers(users);
    }
  };

  const handleSignIn = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    if (isAuth) {
      await signOut(getAuth());
      localStorage.removeItem("name");
      localStorage.removeItem("email");
      localStorage.removeItem("avatar");
      setIsAuth(false);
      window.location.reload();
    } else {
      signInWithPopup(auth, provider)
        .then((result) => {
          const name = result.user.displayName;
          const email = result.user.email;
          const avatar = result.user.photoURL;
          localStorage.setItem("name", name);
          localStorage.setItem("email", email);
          localStorage.setItem("avatar", avatar);
          setIsAuth(true);
          window.location.reload();
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <div
      className="chats"
      style={isMobileView ? { width: "100vw" } : { width: "30vw" }}
    >
      <div className="user">
        <div className="user__wrapper">
          <img
            className="user__logo"
            src={
              localStorage.getItem("avatar") ||
              "https://drive.google.com/uc?id=1tLxNUJRBv3-N6MqbSzGYyziOutMbi10Q"
            }
            alt="user logo"
            width="60"
            height="60"
          />
          {localStorage.getItem("avatar") &&
            localStorage.getItem("name") &&
            localStorage.getItem("email") !== null && (
              <div className="user__info">
                <p className="user__info-name">
                  {localStorage.getItem("name")}
                </p>
                <p className="user__info-email">
                  {localStorage.getItem("email")}
                </p>
              </div>
            )}
          <button
            className="signin-btn"
            onClick={handleSignIn}
            value={
              localStorage.getItem("email") !== null
                ? "Sign Out From Account"
                : "Sign In With Google"
            }
          >
            {localStorage.getItem("name") !== null
              ? "Sign Out From Account"
              : "Sign In With Google"}
          </button>
        </div>
        <div className="search">
          <input
            className="search-input"
            onChange={handleSearchChange}
            ref={searchRef}
            type="text"
            placeholder="Search or start new chat"
          />
        </div>
      </div>
      <h2 className="chats__title">Chats</h2>
      <ul className="chats__list">
        {filteredUsers.map((user) => (
          <ChatUser
            key={user.uid}
            user={user}
            handleListItemClick={handleListItemClick}
            activeUserId={activeUserId}
          />
        ))}
      </ul>
    </div>
  );
}

export default ChatsUserList;
