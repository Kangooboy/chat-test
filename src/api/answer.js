import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import db from "./api";
import uniqid from "uniqid";

const requestURL = "https://api.chucknorris.io/jokes/random";
const avatarChuck =
  "https://drive.google.com/uc?id=13hr6NoJWoS1FyD1er8SnTCfMrworIkC3";

const delay = (ms) => new Promise((r) => setTimeout(() => r(), ms));

const getAnswer = async (activeUserId) => {
  try {
    await delay(1000);
    const responce = await fetch(requestURL);
    const data = await responce.json();
    const collRef = collection(db, "messages");
    addDoc(collRef, {
      text: data.value,
      avatar: avatarChuck,
      name: "Chuck",
      uid: activeUserId,
      id: uniqid(),
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    return console.log(err);
  }
};

export default getAnswer;
