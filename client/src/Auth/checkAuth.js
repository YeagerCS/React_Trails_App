import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./fire";
import { collection, getDocs, query, where } from "firebase/firestore";

export function useAuth() {
  const [authUser, setAuthUser] = useState(() => {
    const storedUser = localStorage.getItem("authUser");  
    return storedUser ? JSON.parse(storedUser) : null;
  });

  async function getUserByUid(uid) {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('uid', '==', uid));
    
    try {
      const querySnapshot = await getDocs(q);
      const userData = querySnapshot.docs.map((doc) => doc.data());
      return userData;
    } catch (error) {
      console.error('Error getting user by UID:', error);
      return null;
    }
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => {
      if (user) {
        
        localStorage.setItem("authUser", JSON.stringify(user));
        setAuthUser(user);
      } else {
        localStorage.removeItem("authUser");
        setAuthUser(null);
      }
    });

    return () => unsub();
  }, []);

  return authUser;
}
