import { db } from '../firebaseConfig';
import { collection, addDoc, onSnapshot, query, where, orderBy, doc, deleteDoc, updateDoc } from 'firebase/firestore';

export async function addTrade(user, assetName, tradingSession, result, pnl, openTime, closeTime, description) {
    try {
        await addDoc(collection(db, 'trades'), { 
            user: user,
            assetName: assetName,
            tradingSession: tradingSession,
            result: result,
            pnl: pnl,
            openTime: openTime,
            closeTime: closeTime,
            description: description,
            dateAdded: new Date()
        });
    } catch (error) {
        console.error("Error adding trade: ", error);
    }
}

export function listenToTrades(user, callback) {
    try {
        const q = query(collection(db, 'trades'), where('user', '==', user), orderBy('closeTime', 'desc'));
        return onSnapshot(q, (querySnapshot) => {
            const trades = [];
            querySnapshot.forEach((doc) => {
                trades.push({ id: doc.id, ...doc.data() });
            });
            callback(trades.sort((a,b) => a.closeTime - b.closeTime));
        });
    } catch (error) {
        console.error("Error fetching trades: ", error);
    }
}

export async function deleteTrade(tradeId) {
    try {
        const tradeDoc = doc(db, 'trades', tradeId);
        await deleteDoc(tradeDoc);
        console.log("Trade successfully deleted!");
    } catch (error) {
        console.error("Error deleting trade: ", error);
    }
}

export async function updateTrade(tradeId, updatedData) {
    try {
        const tradeDoc = doc(db, 'trades', tradeId);
        await updateDoc(tradeDoc, updatedData);
        console.log("Trade successfully updated!");
    } catch (error) {
        console.error("Error updating trade: ", error);
    }
}