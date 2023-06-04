import React, { useEffect, useState } from 'react'
import { useAuth } from './Auth/checkAuth'
import { collection, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { db } from './Auth/fire'
import { updateProfile } from 'firebase/auth'

export default function Contributors({ trail }) {
  const authUser = useAuth()
  const [searchInput, setSearchInput] = useState("")
  const [users, setUsers] = useState([])
  const [contributors, setContributors] = useState([])
  const [searchedUsers, setSearchedUsers] = useState([])

  //TODO: fix rendering problem; allow only the creator to make changes.
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
    console.log(contributors);
    const newContributors = [...contributors, user.uid];
    setContributors(newContributors);
  

    try {
      const querySnapshot = await getDocs(
        query(collection(db, "trails"), where("rid", "==", trail.rid))
      );
      querySnapshot.forEach((doc) => {
        updateDoc(doc.ref, {
          contributors: newContributors
        });
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function removeContributor(user) {
    const newContributors = contributors.filter(current => current !== user.uid);
    setContributors(newContributors);
  
    try {
      const querySnapshot = await getDocs(
        query(collection(db, "trails"), where("rid", "==", trail.rid))
      );
      querySnapshot.forEach((doc) => {
        updateDoc(doc.ref, {
          contributors: newContributors
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
      setContributors(() => data.map(elem => elem.uid))
      setUsers(data)
    }
  }

  function evaluateContributor(user){
    addContributor(user)
    loadContributors()
  }

  useEffect(() => {
    loadContributors()
  }, [])

  return (
    <div className='contributors'>
      <div className='cform'>
        <label htmlFor="users">Username / Email</label>
        <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} type="text" className='boxStyle' name='users'/>
        <button className='btn btn-primary' onClick={searchForUsers}>Search</button>
      </div>
      <div className='clist'>
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

