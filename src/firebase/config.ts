// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBTB-vVAVFcGLQ3SgcbUJblMelThWP2xeA",
    authDomain: "astro-authentication-bbb05.firebaseapp.com",
    projectId: "astro-authentication-bbb05",
    storageBucket: "astro-authentication-bbb05.appspot.com",
    messagingSenderId: "680544004782",
    appId: "1:680544004782:web:94e056a2ae4e5dd5051b3f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
auth.languageCode = 'es';

export const firebase = { 
    app,
    auth
};