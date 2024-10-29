import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {getStorage} from 'firebase/storage'


const firebaseConfig = {
  apiKey: "AIzaSyCJ_WydzRH-3PLCaUWlGuJKzwOpSvEay68",
  authDomain: "webcarros-33745.firebaseapp.com",
  projectId: "webcarros-33745",
  storageBucket: "webcarros-33745.appspot.com",
  messagingSenderId: "1035838161635",
  appId: "1:1035838161635:web:04688337c21f108b45bbd6"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);


export {db,auth,storage}