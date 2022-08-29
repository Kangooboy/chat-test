import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import db from './api';
import uniqid from 'uniqid';

const requestURL = 'https://api.chucknorris.io/jokes/random';
const avatarChuck = 'https://firebasestorage.googleapis.com/v0/b/chat-test-28d82.appspot.com/o/images%2Fchuck.svg?alt=media&token=50c832c9-a4e9-4a1e-9b0a-c5638af52e09';

const delay = (ms) => new Promise((r) => setTimeout(() => r(), ms));

const getAnswer = async(activeUserId) => {
  try{
    await delay(10000);
    const responce = await fetch(requestURL);
    const data = await responce.json();
    const collRef = collection(db, 'messages');
      addDoc(collRef, {
        text: data.value,
        avatar: avatarChuck,
        name:'Chuck',
        uid: activeUserId,
        id: uniqid(),
        createdAt: serverTimestamp()
      })
  } catch(err) {
    return console.log(err);
  }
}

export default getAnswer;
