import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyDIgbQEeYmrudCCf5gaqziAFK-RvT3KPZU",
    authDomain: "m248-projekt.firebaseapp.com",
    projectId: "m248-projekt",
    storageBucket: "m248-projekt.appspot.com",
    messagingSenderId: "234538111854",
    appId: "1:234538111854:web:bcc854a1c77f323bfca77f",
    measurementId: "G-NSH5N7MTMR"
  };

  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

