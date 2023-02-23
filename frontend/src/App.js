import './App.css';
import React, {} from 'react'
import Dash from './Dash'
import HomePage from './pages/HomePage'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'

function App() {
  return (
    <div className="App-header">
    <Router>
      <Routes >
        <Route  exact path='/' element={<HomePage />} />
        <Route exact path='/dash' element={<Dash />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
