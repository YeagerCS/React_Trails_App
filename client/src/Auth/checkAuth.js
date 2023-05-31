import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./fire";

export function useAuth() {
  const [authUser, setAuthUser] = useState(() => {
    const storedUser = localStorage.getItem("authUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });

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
