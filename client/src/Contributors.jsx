import React, { useEffect, useState } from 'react'
import { useAuth } from './Auth/checkAuth'
import { collection, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { db } from './Auth/fire'
import { updateProfile } from 'firebase/auth'

export default function Contributors({ trail }) {
  const authUser = useAuth()
  const [searchInput, setSearchInput] = useState("")
  const [users, setUsers] = useState([])
  const [searchedUsers, setSearchedUsers] = useState([])
  const []

  //TODO: allow only the creator to make changes.

  async function loadCreator(){

  }

  async function searchForUsers(e){
    e.preventDefault()
    try{
      const snapshotOne = await getDocs(
        query(collection(db, "users"), where("displayName", "!=", null))
      );

      const data = snapshotOne.docs.map(doc => doc.data())
      const filtered = data.filter(user => user.displayName.includes(searchInput))
      setSearchedUsers(filtered)
    } catch(error){
      console.error(error)
    }
  }

  async function addContributor(user) {
    const newContributors = users.map(obj => obj.uid)
    const addedContributors = [...newContributors, user.uid]
    try {
      const querySnapshot = await getDocs(
        query(collection(db, "trails"), where("rid", "==", trail.rid))
      );
      querySnapshot.forEach((doc) => {
        updateDoc(doc.ref, {
          contributors: addedContributors
        });
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function removeContributor(user) {
    const newContributors = users.filter(current => current.uid !== user.uid);
    const activeContributors = users.map(obj => obj.uid)
  
    try {
      const querySnapshot = await getDocs(
        query(collection(db, "trails"), where("rid", "==", trail.rid))
      );
      querySnapshot.forEach((doc) => {
        updateDoc(doc.ref, {
          contributors: activeContributors
        });
      });
    } catch (error) {
      console.error(error);
    }
  }
  

  async function loadContributors(){
    const trailSnap = await getDocs(
      query(collection(db, "trails"), where("rid", "==",  trail.rid))
    )
    const newTrail = trailSnap.docs.map(doc => doc.data())
    console.log("trails", newTrail);

    const snapshot = await getDocs(
      query(collection(db, "users"), where("uid", "in",  newTrail[0].contributors))
    )

    const data = snapshot.docs.map(doc => doc.data())
    console.log("loading", data);
    if(data){
      setUsers(data)
    }
  }

  async function evaluateContributor(user){
    await addContributor(user)
    await loadContributors()
  }

  useEffect(() => {
    async function loadSyncContributors(){
      await loadContributors()
    }

    loadSyncContributors()
  }, [])

  return (
    <div className='contributors'>
      <div className='cform'>
        <label htmlFor="users">Username / Email</label>
        <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} type="text" className='boxStyle' name='users'/>
        <button className='btn btn-primary' onClick={searchForUsers}>Search</button>
      </div>
      <div className='clist'>
        <h2>Search</h2>
        <table className='styled-table search-table'>
          <thead>
            <tr>
              <th></th>
              <th>Username</th>
              <th>Email</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {searchedUsers && searchedUsers.map((user, index) => {
              return (
                <>
                  <tr key={user.email}>
                    <td><img src={user.photoURL}/></td>
                    <td>{user.displayName}</td>
                    <td>{user.email}</td>
                    <td><button className='btn btn-primary' onClick={() => evaluateContributor(user)}>Add</button></td>
                  </tr>
                </>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className='clist2'>
        <h2>Active Contributors</h2>
        <table className='styled-table search-table'>
          <thead>
            <tr>
              <th></th>
              <th>Username</th>
              <th>Email</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users && users.map((user, index) => {
              return (
                <>
                  <tr key={user.email}>
                    <td><img src={user.photoURL}/></td>
                    <td>{user.displayName}</td>
                    <td>{user.email}</td>
                    <td><button className='btn btn-dark btn-outline-danger' onClick={() => removeContributor(user)}>Remove</button></td>
                  </tr>
                </>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

