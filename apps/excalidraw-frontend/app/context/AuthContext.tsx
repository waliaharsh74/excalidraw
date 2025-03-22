"use client"
import { createContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
    login: boolean;
    setLogin: (status: boolean) => void;
    handleLogOut: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [login, setLogin] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const userLogin = localStorage.getItem("shapeSmithToken");
        if (userLogin) {
            setLogin(true);
        }
    }, []);

    const handleLogOut = () => {
        localStorage.removeItem("shapeSmithToken"); 
        setLogin(false);
        router.push("/"); 
    };

    return (
        <AuthContext.Provider value={{ login, setLogin, handleLogOut }}>
            {children}
        </AuthContext.Provider>
    );
};
