import React, { useState } from 'react';
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleAuthProvider } from "./fire"
import { useNavigate } from 'react-router-dom';
import { useAuth } from './checkAuth';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./fire" 

export default function Registration({ handleGoogleLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [PhotoUrl, setPhotoUrl] = useState('');
  const navigate = useNavigate();
  
  function handleRegistration() {
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      //debugger;
      window.setTimeout(() => {
        addAdditionalRowsToUser(user.uid, "displayName", displayName, "emailVerfied", false, "photoURL", PhotoUrl)
          .then((_) => { 
            console.log('Additional row added to the user document successfully.' + _);
            window.setTimeout(() => {
              // navigate("/");
            }, 500) ;
          })
      }, 1500) ;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    })
  };

  const addAdditionalRowsToUser = async (userId, fieldName, fieldValue, fieldName2, fieldValue2, fieldName3, fieldValue3) => {
    const updatedData = {
      [fieldName]: fieldValue,
      [fieldName2]: fieldValue2,
      [fieldName3]: fieldValue3,
    }
    try {
      const docRef = doc(collection(db, "users"), userId);
      return updateDoc(docRef, updatedData); 
    } catch (error) {
      console.error('Error adding additional row to the user document:', error);
    }
  };

  function handleGoogleLogin(){
    signInWithPopup(auth, googleAuthProvider).then(result => {
      const credenetial = GoogleAuthProvider.credentialFromResult(result)
      const token = credenetial.accessToken;

      const user = result.user;
      console.log(user);
      navigate("/")
    }).catch(error => console.error(error))
  }

  return (
    <>
    <div className="popup-overlay">
      <div className="popup">
        <h2>Register</h2>
        <form>
        <input
            className='boxStyle'
            type="text"
            placeholder="Username"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}/>
            <input
            className='boxStyle'
            type="text"
            placeholder="ULR"
            value={PhotoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}/>
          <input
            className='boxStyle'
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}/>
          <input
            className='boxStyle'
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}/>
            <br />
          <button className='RegistartionsButton' type="button" onClick={handleRegistration}>Register</button>
          <p id='keinKontoText'>Bereits ein konto? <a href="/Login">Log in</a></p>
        </form>
        <button className='googleBtn' onClick={handleGoogleLogin}><i className="fab fa-google"></i> Google</button>
      </div>
    </div>
    </>
  );
};
