import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import * as authAPI from "../api/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [token, setToken] = useState(
        localStorage.getItem("token")
    );

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        setLoading(false);

    }, []);

    async function login(email, password) {

        const data = await authAPI.login(
            email,
            password
        );

        localStorage.setItem(
            "token",
            data.access_token
        );

        setToken(data.access_token);
    }

    function logout() {

        localStorage.removeItem("token");

        setToken(null);
    }

    return (

        <AuthContext.Provider
            value={{
                token,
                login,
                logout,
                authenticated: !!token,
            }}
        >

            {!loading && children}

        </AuthContext.Provider>

    );

}

export function useAuth() {

    return useContext(AuthContext);

}