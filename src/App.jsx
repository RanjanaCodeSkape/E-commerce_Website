
import './App.css'  

import SignUp from './components/signup/Signup';
import Login from './components/login/Login';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';

const App = () => {


  return (
    <>
    
    <Routes>
    <Route path="/" element={<SignUp/>} />
    <Route path="/login" element={<Login/>} />
    <Route path="/homepage" element={<HomePage/>} />
    
    </Routes>
    </>
  );
};

export default App;
