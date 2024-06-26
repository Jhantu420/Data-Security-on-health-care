import { Routes, Route } from "react-router-dom";
import './App.css';
import './CSS/Home.css';
import Navbar  from "./component/Navbar";
import {useEffect, useState} from 'react';
import Home from "./component/Home"
import SignUp from "./component/Signup"
import SignIn from "./component/LoginForm"
import DoctorRegister from "./component/Doctor_reg"
import NurseRegister from './component/Nurse_reg'
import Dashboard from './component/Dashboard'
function App() {
  const current_theme = localStorage.getItem('current_theme');
  const [theme, setTheme] = useState(current_theme? current_theme:'light');

  useEffect(()=>{
    localStorage.setItem('current_theme',theme);
  },[theme])
  return (
    <>
    <div className= {`container ${theme}`}>
    <Navbar theme={theme} setTheme={setTheme}/>
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/sign-up" element={<SignUp/>}/>
      <Route path="/sign-in" element={<SignIn/>}/>
      <Route path="/doctor-sign-up" element={<DoctorRegister/>}/>
      <Route path="/nurse-sign-up" element={<NurseRegister/>}/>
      <Route path="/doctor-dashboard" element={<Dashboard/>}/>
    </Routes>
    </div>
    </>
  );
}

export default App;
