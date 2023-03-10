import './App.css';
import React, {} from 'react'
import Dash from './pages/Dashboard'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import TestPage from './pages/TestPage'
import HousePage from './pages/HousePage'
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'

function App() {
  return (
    <div className="GlobalStyle">
    <Router>
      <Routes>
        <Route  exact path='/login' element={<LoginPage />} />
        <Route  exact path='/register' element={<RegisterPage />} />
        <Route exact path='/dashboard' element={<Dash />} />
        <Route exact path='/test' element={<TestPage />} />
        <Route exact path='/house' element={<HousePage />} />
        <Route path="*" element={<Navigate to="login" replace />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
