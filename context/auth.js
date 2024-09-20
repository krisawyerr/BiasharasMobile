import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext({
    user: "",
    token: "",
    isAuthed: false,
    auth: (token, user) => {},
    logout: () => {}
});

export default function AuthContextProvider({children}) {
    const [authToken, setAuthToken] = useState()
    const [user, setUser] = useState()

    function auth(token, email) {
        setAuthToken(token);
        AsyncStorage.setItem("token", token);

        setUser(email);
        AsyncStorage.setItem("user", email);
    }

    function logout() {
        setAuthToken(null);
        AsyncStorage.removeItem("token")
        setUser(null);
        AsyncStorage.removeItem("user")
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