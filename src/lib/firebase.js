// lib/firebase.js
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyDsOP-Q9K8EtlcI_Bda7vOe2De3asx9nAU",
    authDomain: "brianaldybramasta-7742f.firebaseapp.com",
    projectId: "brianaldybramasta-7742f",
    storageBucket: "brianaldybramasta-7742f.firebasestorage.app",
    messagingSenderId: "239948994736",
    appId: "1:239948994736:web:5f387bcb382d954801c375",
    measurementId: "G-21JTLYHRT0"
};

const app = initializeApp(firebaseConfig);

export default app;
