import { initializeApp } from "firebase/app";
import firebase from "firebase/compat/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import { getStorage } from "firebase/storage";
import firebaseConfig from "./config/firebaseConfig";
import "firebase/compat/auth";

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp); // For Authentication
const db = getFirestore(firebaseApp); // For Using Database
const storage = getStorage(firebaseApp);

export { auth, db, firebaseApp, storage, firebase };
