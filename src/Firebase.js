import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAJ4VkcMLT01_Qc6VmszGLRu8Bnqi6yaBU",
  authDomain: "serverstatustracker.firebaseapp.com",
  projectId: "serverstatustracker",
  storageBucket: "serverstatustracker.appspot.com",
  messagingSenderId: "606031045534",
  appId: "1:606031045534:web:df17f4e17e43b4b5106c8f",
  measurementId: "G-VN8BSCPJEQ"
};

const app = initializeApp(firebaseConfig);
export { app };