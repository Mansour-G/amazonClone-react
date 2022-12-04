import { initializeApp, getApp, getApps } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAF2Dn5360inHNPXhOYIvOfH-fKBF-w6uA",
  authDomain: "fir-90757.firebaseapp.com",
  projectId: "fir-90757",
  storageBucket: "fir-90757.appspot.com",
  messagingSenderId: "237109896762",
  appId: "1:237109896762:web:642c4b4827625fb0267703"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export default app;