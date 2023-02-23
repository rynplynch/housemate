import './App.css';
import React, {} from 'react';

//url to retrieve cookie for user
//and dummy data for that user
// const URL = 'http://localhost:8080/login';
const URL = '/login';
const defUser = {
    "email": "janedoe@gmail.com",
    "password": "pass"
};

//test POST method to login
const regDefault = () => {
  fetch(URL, {
    method: 'POST',
    include: 'credentials',
    body: defUser
  })
    .then( response => response.json())
    .catch( e => console.log(e) )
}

function App() {


  return (
    <div className="App">
      <header className="App-header">
        WORKING DEMO
        <button onClick={regDefault}> Login as default user</button>
      </header>
    </div>
  );
}

export default App;
