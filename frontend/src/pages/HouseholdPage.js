import React, { useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';

//endpoints for backend
const GET_HOUSE = 'household/'

function Dash() {

  // useState returns two values, an array and a function
  // only ever change the value of the array with the
  // returned function
  const [bills,setBills] = useState([]);
  const [loans,setLoans] = useState([]);
  const [mates,setMates] = useState([]);

  //states for bill creation
  //passed as props to BillForm
  const [debtor, setDebtor] = useState(1);
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
        console.log("Bills: ", data.bills)
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
        console.log("Loans: ", data.bills)
      })
      .catch( e => console.log(e) )
  }

  //GET roommates for current user
  const getMates = () => {
    fetch(MATES_URL, {
      credentials: 'include'
    })
      .then( response =>response.json())
      .then( data => {
        if(data.roommates!=null)
          setMates([...data.roommates]);
        if(data.roommates == null) setMates([]);
        console.log("Roommates: ",data.roommates)
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
          getAss()
        }
      })
      .catch(e => alert(e))
 }

  const deleteLoan = (id) => {
    fetch(BILL_URL+`/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
      .then( response => {
        if(response.status == 200){
          getAss()
          getLoan()
        }
      })
      .catch( e => console.log(e) )
  }
  // DELETE a loan based on bill id

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
    getMates()
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
        mates={mates}
      />
      <Bills bills={bills} mates={mates}/>
      <Loans loans={loans} mates={mates} deleteLoan={deleteLoan}/>
    </div>
    );
}

export default Dash;
