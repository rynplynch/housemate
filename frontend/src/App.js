import './App.css';
import React, {useState} from 'react';
import DisplayBills from './components/bills/DisplayBill'

//endpoints for backend
//not sure if these will work in production
//so putting them here for easy changing
const LOGIN_URL = '/login';
const ASS_URL = '/assigned';

//and dummy data for test user
const defUser = {
    "email": "janedoe@gmail.com",
    "password": "pass"
};

//test POST method to login
const postLogin= () => {
  fetch(LOGIN_URL, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(defUser)
  })
    .catch( e => console.log(e) )
}

//test GET for bills associated to user

function App() {
  const [bills,setBills] = useState([]);

  const getAss= () => {
    fetch(ASS_URL, {
      credentials: 'include'
    })
      .then( response => response.json() )
      .then( data => {
        console.log(data.bills);
        setBills(data.bills);
      });
  }

  return (
    <div className="App">
      <header className="App-header">
        WORKING DEMO
        <button onClick={postLogin}> Login as default user</button>
        <button onClick={getAss}> Get associated bills</button>
        {bills.map((bill) => {
          return (
            <div key={bill.id}>
            <DisplayBills
              amount={bill.amount}
              creditor={bill.creditor}
              description={bill.description}
              due={bill.due}/>
            </div>
          );
        })}
      </header>
    </div>
  );
}

export default App;
