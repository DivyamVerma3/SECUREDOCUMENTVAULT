import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] =useState(null);

    const login = (token) => {

        localStorage.setItem("token", token);

        try {

            const payload = JSON.parse(
                atob(token.split(".")[1])
            );

            setUser({
                email: payload.sub
            });

        } catch {

            setUser(null);

        }

    };

    const logout = () => {

        localStorage.removeItem("token");
        setUser(null);

    };

    return (

        <AuthContext.Provider
            value={{
                user,
                login,
                logout
            }}
        >

            {children}

        </AuthContext.Provider>

    );

}

export function useAuth() {

    return useContext(AuthContext);

}