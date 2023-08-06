import { createContext, useEffect, useState } from "react";
import { auth } from '../firebase'
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";


export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [userLoading, setUserLoading] = useState(true);
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user)
                setUserLoading(true)
            } else {
                setUser(null)
            }
            setUserLoading(false)
        })
    }, [])

    const login = async () => {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
    }

    const logOut = () => {
        signOut(auth);
    }
    
    return (
        <AuthContext.Provider value={{ login, user, logOut, userLoading }}>
            {children}
        </AuthContext.Provider>
    )
}