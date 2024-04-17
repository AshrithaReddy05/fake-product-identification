import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Loginform from './Components/Loginform';
import Home from './Components/Home';
import Navbar from './Components/Navbar';
import Intro from './Components/Intro';
import './index.css';

function App() {
  return (
      <Router>
        <Routes>
          {/* <Route path='/' element={<Intro/>} /> */}
          <Route path='/' element={<Loginform />} /> {/* Use AuthForm as the component */}
          <Route path='/Home' element={<Home />} />
        </Routes>
      </Router>
  );
}

export default App;
