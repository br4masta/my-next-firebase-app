// firebase-config.js
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDsOP-Q9K8EtlcI_Bda7vOe2De3asx9nAU",
    authDomain: "brianaldybramasta-7742f.firebaseapp.com",
    projectId: "brianaldybramasta-7742f",
    storageBucket: "brianaldybramasta-7742f.firebasestorage.app",
    messagingSenderId: "239948994736",
    appId: "1:239948994736:web:5f387bcb382d954801c375",
    measurementId: "G-21JTLYHRT0"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firestore
const db = getFirestore(app);

// Initialize Storage
const storage = getStorage(app);

export { app, db, storage };