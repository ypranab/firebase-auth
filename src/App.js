import React, { useState } from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);

function App() {

  const provider = new firebase.auth.GoogleAuthProvider();

  const [user, setUser] = useState({
    isSigned: false,
    name: '',
    photo: '',
    email: ''
  })
  const handleSingIn = () => {
    firebase.auth().signInWithPopup(provider)
      .then(result => {
        const { displayName, photoURL, email } = result.user;
        const signedInUser = {
          isSigned: true,
          name: displayName,
          photo: photoURL,
          email: email
        }
        setUser(signedInUser);
        //console.log(displayName, photoURL, email)
      }).catch(error => {
        //console.log(error)
        //console.log(error.message)
      })
  }

  const handleSingOut = () => {
    firebase.auth().signOut()
      .then(result => {
        // Sign-out successful.
        const signedOutUser = {
          isSigned: false,
          name: '',
          photo: '',
          email: '',
          password: '',
          isValid: false,
          error: '',
          existingUser: false
        }
        setUser(signedOutUser)
      }).catch(error => {
        // An error happened.
      })
  }

  const validEmail = email =>  /(.+)@(.+){2,}\.(.+){2,}/.test(email);
  const hasNumber = input => /\d/.test(input);

  const switchForm = e => {
    const createdUser = {...user};
    createdUser.existingUser = e.target.checked;
    setUser(createdUser)
  }

  const handleInput = event => {
    const newUserInfo = {
      ...user
    };

    // perform validation
    let isValid = true;

    if(event.target.name === "email") {
      isValid = validEmail(event.target.value);
    }

    if (event.target.name === 'password') {
      isValid = event.target.value.length > 6 && hasNumber(event.target.value);
    }

    //console.log(event.target.value)
    newUserInfo[event.target.name] = event.target.value;
    newUserInfo.isValid = isValid;
    setUser(newUserInfo)
   // console.log(event.target.name, event.target.value)
  }
  
  const handleCreateAccount = (event) => {
    if(user.isValid) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res => {
        const createdUser = {...user};
        createdUser.isSigned = true;
        createdUser.error = '';
        setUser(createdUser)
      })
      .catch(error => {
        console.log(error.messege)
        const createdUser = {...user};
        createdUser.isSigned = false;
        createdUser.error = error.message;
        setUser(createdUser)
      })
    }
    event.preventDefault(); 
    event.target.reset();
  }

  const signInUser = (e) => {
    if(user.isValid) {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(res => {
        console.log(res)
        const createdUser = {...user};
        createdUser.isSigned = true;
        createdUser.error = '';
        setUser(createdUser)
      })
      .catch(error => {
        console.log(error.messege)
        const createdUser = {...user};
        createdUser.isSigned = false;
        createdUser.error = error.message;
        setUser(createdUser)
      })
    }
    e.preventDefault();
    e.target.reset();
  }

  return (
    <div className="App">
      {
        user.isSigned ? <button onClick={handleSingOut}><h2> Sign Out </h2></button> :
          <button onClick={handleSingIn}><h2> Sign In </h2></button>
      }
      {
        user.isSigned &&
        <div>
          <p>Welcome, {user.name}</p>
          <p>Email: {user.email}</p>
          <img src={user.photo} alt="" />
        </div>
      }
      <h2>Our Authentication</h2>
      <input type="checkbox" name="switchForm" onChange={switchForm} id="switchForm"/>
      <label htmlFor="switchForm">Returning User</label>

      <form style={{display: user.existingUser ? 'block' : 'none'}} onSubmit={signInUser}>
        <input type="text" name="email" onBlur={handleInput} placeholder="Email" required></input> <br/>
        <input type="password" name="password" onBlur={handleInput} placeholder="Password" required></input><br/>
        <input type="submit" value="Login"/>
      </form>

      <form  style={{display: user.existingUser ? 'none' : 'block'}} onSubmit={handleCreateAccount}>
        <input type="text" name="name" onBlur={handleInput} placeholder="Name" required></input> <br/>
        <input type="text" name="email" onBlur={handleInput} placeholder="Email" required></input> <br/>
        <input type="password" name="password" onBlur={handleInput} placeholder="Password" required></input><br/>
        <input type="submit" value="create account"/>
      </form>
      {
        user.error && <p>{user.error}</p>
      }
    </div>
  );
}

export default App;
