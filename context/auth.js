import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useState } from "react";

export const AuthContext = createContext({
    user: "",
    token: "",
    isAuthed: false,
    auth: (token, user) => {},
    logout: () => {}
});

export default function AuthContextProvider({children}) {
    const [authToken, setAuthToken] = useState();
    const [user, setUser] = useState();

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

    const value = {
        token: authToken,
        user: user,
        isAuthed: !!authToken,
        auth: auth,
        logout: logout
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
