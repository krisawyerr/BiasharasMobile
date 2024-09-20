import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { Keys } from './constants/keys';

const firebaseConfig = {
  apiKey: Keys.apiKey,
  authDomain: Keys.authDomain,
  projectId: Keys.projectId,
  storageBucket: Keys.storageBucket,
  messagingSenderId: Keys.messagingSenderId,
  appId: Keys.appId,
  measurementId: Keys.measurementId
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
