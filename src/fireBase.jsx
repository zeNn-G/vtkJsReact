// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC3wOcG2RmVMTShL2d6Llvg9vzLblfFvqA",
  authDomain: "vtkjs-2f915.firebaseapp.com",
  projectId: "vtkjs-2f915",
  storageBucket: "vtkjs-2f915.appspot.com",
  messagingSenderId: "630453030129",
  appId: "1:630453030129:web:7c355e21893db0ef852d50",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
