import React, {useState} from 'react';
import DisplayBills from './components/bills/DisplayBill'
import { useNavigate } from 'react-router-dom';

//endpoints for backend
//not sure if these will work in production
//so putting them here for easy changing
const ASS_URL = '/assigned';


function Dash() {
  //setting state for used variables
  const [bills,setBills] = useState([]);

  //navigator that redirects to new page
  const navigate = useNavigate();

  //GET assigned
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
  // logout by moving back to homepage TODO: new endpoint which deletes cookie
  const logout = () => {
    navigate('/')
  }

  return (
    <div>
      <button onClick={logout}>Logout</button>
      <h1>WORKING DEMO</h1>
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
    </div>
  );
}

export default Dash;
