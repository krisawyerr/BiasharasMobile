import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useState } from "react";

export const AuthContext = createContext({
    user: "",
    token: "",
    isAuthed: false,
    backtestTrades: [],
    auth: (token, user) => {},
    logout: () => {},
    setBacktest: (trades) => {},
    removeBacktest: () => {},
    loadBacktest: () => {},
});

export default function AuthContextProvider({children}) {
    const [authToken, setAuthToken] = useState();
    const [user, setUser] = useState();
    const [backtestTrades, setBacktestTrades] = useState();

    async function auth(token, email) {
        if (token && email) {
            setAuthToken(token);
            await AsyncStorage.setItem("token", token);
            setUser(email);
            await AsyncStorage.setItem("user", email);
        }
    }

    async function logout() {
        setAuthToken(null);
        await AsyncStorage.removeItem("token");
        setUser(null);
        await AsyncStorage.removeItem("user");
    }

    async function setBacktest(trades) {
        if (trades) {
            setBacktestTrades(trades);
            await AsyncStorage.setItem("backtestTrades", JSON.stringify(trades));
        }
    }
    
    async function removeBacktest() {
        setBacktestTrades(null);
        await AsyncStorage.removeItem("backtestTrades");
    }
    
    async function loadBacktest() {
        const storedTrades = await AsyncStorage.getItem("backtestTrades");
        if (storedTrades) {
            setBacktestTrades(JSON.parse(storedTrades)); 
        }
    }

    const value = {
        token: authToken,
        user: user,
        backtestTrades: backtestTrades,
        isAuthed: !!authToken,
        auth: auth,
        logout: logout,
        setBacktest: setBacktest,
        removeBacktest, removeBacktest,
        loadBacktest: loadBacktest
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
