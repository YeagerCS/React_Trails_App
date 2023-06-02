import React, { useEffect, useState } from 'react';
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleAuthProvider, storage } from "./fire"
import { useNavigate } from 'react-router-dom';
import { useAuth } from './checkAuth';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc} from "firebase/firestore";
import { db } from "./fire" 
import { ScrollZoomHandler } from 'mapbox-gl';
import { getDownloadURL } from 'firebase/storage';
import { ref, uploadBytes } from 'firebase/storage';

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
      window.setTimeout(() => {
        addAdditionalRowsToUser(user.uid, "displayName", displayName, "emailVerfied", false, "photoURL", PhotoUrl)
          .then((_) => { 
            console.log('Additional row added to the user document successfully.' + _);
            navigate("/")
          })
      }, 1000) ;
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

  function openFileChooser(e) {
    e.preventDefault()
    const fileInput = document.getElementById('url');
    fileInput.click();
    setPhotoUrl(null)
  }

  function handleGoogleLogin(){
    signInWithPopup(auth, googleAuthProvider).then(result => {
      const credenetial = GoogleAuthProvider.credentialFromResult(result)
      const token = credenetial.accessToken;

      const user = result.user;
      console.log(user);
      navigate("/")
    }).catch(error => console.error(error))
  }



  async function handleFileSelection(e){
    e.preventDefault()
    const selectedFile = e.target.files[0]

    const storageRef = ref(storage, selectedFile.name)

    try{  
      const snapshot = await uploadBytes(storageRef, selectedFile)
      const url = await getDownloadURL(snapshot.ref)
      setPhotoUrl(url)
    } catch(error){
      console.log(error);
    }
    console.log(selectedFile);  
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
           <input type="file" name="url" id="url" onChange={handleFileSelection}/>
           <button className='btnStyle' onClick={openFileChooser}>Choose File</button>
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
