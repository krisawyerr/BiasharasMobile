import { db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export async function addTrade(user, assetName, tradingSession, result, pnl, openTime, closeTime) {
    try {
        await addDoc(collection(db, 'trades'), { 
            user: user,
            assetName: assetName,
            tradingSession: tradingSession,
            result: result,
            pnl: pnl,
            openTime: openTime,
            closeTime: closeTime,
            dateAdded: new Date()
        });
        console.log("Trade successfully added!");
    } catch (error) {
        console.error("Error adding trade: ", error);
    }
}
