import axios from "axios";
import { db } from '../firebaseConfig';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { Keys } from "../constants/keys";

export async function authUser(mode, email, password, fname, lname) {
    let link = mode === "login" ? "signInWithPassword" : "signUp"

    const response = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:${link}?key=${Keys.apiKey}`, {
        email: email,
        password: password,
        returnSecureToken: true
    })

    const token = response.data.idToken

    if (token && mode !== "login") {
        await addDoc(collection(db, 'users'), { 
            email: email,
            fname: fname,
            lname: lname,
            isMember: false,
            dateJoined: new Date()
        });
    }

    return token
}