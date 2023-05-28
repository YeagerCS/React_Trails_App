import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "./fire";


export function useAuth(){
    const [authUser, setAuthUser] = useState(null)

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, user => {
            if(user){
                setAuthUser(user)
            } else{
                setAuthUser(null)
            }
        })

        return () => unsub()
    }, [])

    return authUser;
}
