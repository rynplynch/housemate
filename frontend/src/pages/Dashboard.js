import React, { useEffect, useState} from 'react';
import Loans from '../components/loans/Loans'
import Bills from '../components/bills/Bills'
import BillForm from '../components/bills/BillForm'
import { useNavigate } from 'react-router-dom';

//endpoints for backend
const ASS_URL = '/assigned';
const LOAN_URL = '/created';
const BILL_URL = '/bill';

function Dash() {

  //setting state for used variables
  const [bills,setBills] = useState([]);
  const [loans,setLoans] = useState([]);

  //states for bill creation
  //passed as props to BillForm
  const [debtor, setDebtor] = useState(0);
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');
  const [dateTime, setDateTime] = useState('');

  //GET assigned bills
  const getAss= () => {
    fetch(ASS_URL, {
      credentials: 'include'
    })
      .then( response => response.json() )
      .then( data => {
        if(data.bills!=null){
          setBills([...data.bills])
        }
      })
      .catch( e => console.log(e) )
  }

  //GET loans current user has made
  const getLoan= () => {
    fetch(LOAN_URL, {
      credentials: 'include'
    })
      .then( response => response.json() )
      .then( data => {
        if(data.bills!=null)
          setLoans([...data.bills]);
        if(data.bills == null) setLoans([]);
      })
      .catch( e => console.log(e) )
  }

  // POST a new bill using data from BillForm
  const postBill = () => {
    fetch(BILL_URL, {
      method: 'POST',
      credentials: 'include',
      // body: JSON.stringify(data)
      body: JSON.stringify({
        amount: amount,
        debtor: debtor,
        description: desc,
        due: new Date(dateTime)
      })
    })
      .then(res => {
        if (res.status == 200) {
          getLoan()
        }
      })
      .catch(e => console.log(e))
 }

  // DELETE a loan based on bill id
  const deleteLoan = (id) => {
    fetch(BILL_URL+`/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
      .then( response => {
        if(response.status == 200){
          getLoan()
        }
      })
      .catch( e => console.log(e) )
  }

  //navigator that redirects to new page
  const navigate = useNavigate();

  //logout button just takes us away from current page
  // TODO: use endpoint to remove cookie from client
  const logout = () => {
    navigate('/')
  }

  //calls api when the application first mounts
  useEffect( () => {
    getAss()
    getLoan()
  }, [])

  return (
    <div>
      <button onClick={logout}>Logout</button>
      <h1>DashBoard</h1>
      <BillForm
        debtor={debtor}
        setDebtor={setDebtor}
        amount={amount}
        setAmount={setAmount}
        desc={desc}
        setDesc={setDesc}
        due={dateTime}
        setDue={setDateTime}
        postBill={postBill}
      />
      <Bills bills={bills} getAss={getAss}/>
      <Loans loans={loans} deleteLoan={deleteLoan}/>
    </div>
    );
}

export default Dash;
