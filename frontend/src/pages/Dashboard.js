import React, { useEffect, useState} from 'react';
import Loans from '../components/loans/Loans'
import Bills from '../components/bills/Bills'
import BillForm from '../components/bills/BillForm'
import InviteForm from '../components/household/InviteForm'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom';


//endpoints for backend
const ASS_URL = 'bills/assigned';
const LOAN_URL = 'bills/created';
const BILL_URL = '/bills';
const MATES_URL = 'household/roommates'
const INV_URL = 'household/invite'

function Dash() {

  // useState returns two values, an array and a function
  // only ever change the value of the array with the
  // returned function
  const [bills,setBills] = useState([]);
  const [loans,setLoans] = useState([]);
  const [mates,setMates] = useState([]);

  //states for bill creation
  //passed as props to BillForm
  // const [debtor, setDebtor] = useState('');
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
        // console.log("Bills: ", data.bills)
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
        // console.log("Loans: ", data.bills)
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
        // console.log("Roommates: ",data.roommates)
      })
      .catch( e => console.log(e) )
  }

  // POST a new bill using data from BillForm
  const postBill = (debtor) => {
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

  const postInv = (email) => {
    fetch(INV_URL, {
      method: 'POST',
      credentials: 'include',
      // body: JSON.stringify(data)
      body: JSON.stringify({
        email: email
      })
    })
      .then(res => {
        if (res.status == 200) {
          console.log(JSON.stringify(res))
          getMates()
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

  //navigator that redirects to new page
  const navigate = useNavigate();

  //move back to login page
  const goToLogin = (event) => {
    event.preventDefault
    navigate('/login')
  }

  //calls api when the application first mounts
  useEffect( () => {
    getAss()
    getLoan()
    getMates()
  }, [])

const Title = styled.h1`
color: #fff;
font-weight: 500;
`
  const Header = styled.div`
display: flex;
justify-content: space-between;
`
  return (
    <div>
      <Header>
      <Title>DashBoard</Title>
      <button onClick={goToLogin}>Go to login</button>
      </Header>
      <BillForm
        amount={amount}
        setAmount={setAmount}
        desc={desc}
        setDesc={setDesc}
        due={dateTime}
        setDue={setDateTime}
        postBill={postBill}
        mates={mates}
      />
      <InviteForm postInv={postInv}/>
      <Bills bills={bills} mates={mates} getAss={getAss}/>
      <Loans loans={loans} mates={mates} deleteLoan={deleteLoan}/>
    </div>
    );
}

export default Dash;
