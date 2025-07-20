
import { useEffect } from 'react'
import './App.css'
import {auth} from "./firebase-config"
import {signInAnonymously, onAuthStateChanged} from "firebase/auth"
import {TextEditor} from './components/Text-editor';


function App() {
  
  useEffect(()=>{
    signInAnonymously(auth);
    onAuthStateChanged(auth,user =>{
      if(user){
        console.log("user is signed in ",user.uid);

      }else{
        console.log("user is not signed in");
      }
    })
  },[])

  return (
    <div className='App'>
      <header><h1>Google Docs Clone</h1></header>
      
      <TextEditor/>
    </div>
  )
}

export default App
