import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBoy0khnRUroeRS1LmvabOcZZ9gTm02yl8",
  authDomain: "healingsphere-a9881.firebaseapp.com",
  projectId: "healingsphere-a9881",
  storageBucket: "healingsphere-a9881.appspot.com",
  messagingSenderId: "957528874592",
  appId: "1:957528874592:web:1bc4ace475f489e7802d05"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);


