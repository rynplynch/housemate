import React, {useState} from 'react';
import CreatedBill from './components/bills/CreatedBill'
import TestBill from './components/bills/TestBill'
import CreateBill from './components/bills/CreateBill'
import { useNavigate } from 'react-router-dom';
import style, {} from 'styled-components';

//endpoints for backend
//not sure if these will work in production
//so putting them here for easy changing
const ASS_URL = '/assigned';
const LOAN_URL = '/created';

function Dash() {

  //setting state for used variables
  const [bills,setBills] = useState([]);
  const [loans,setLoans] = useState([]);

  //GET assigned
  const getAss= () => {
    fetch(ASS_URL, {
      credentials: 'include'
    })
      .then( response => response.json() )
      .then( data => {
        if(data.bills!=null)
          setBills(data.bills);
        console.log(data.bills);
      })
      .catch( e => console.log(e) )
  }

  const getLoan= () => {
    fetch(LOAN_URL, {
      credentials: 'include'
    })
      .then( response => response.json() )
      .then( data => {
        if(data.bills!=null)
          setLoans(data.bills);
        if(data.bills == null) setLoans([]);
      })
      .catch( e => console.log(e) )
  }

  //navigator that redirects to new page
  const navigate = useNavigate();


  const logout = () => {
    navigate('/')
  }
  const CompWrap = style.div`
padding: 5px;
display: flex;
flex-wrap: wrap;
justify-content: center;
`
  const DashWrap = style.div`
  align-items: center;
display: flex;
flex-direction: column;
justify-content: center;
`
  return (
   <div>
     <DashWrap>
    <CompWrap>
      <button onClick={logout}>Logout</button>
    </CompWrap>

    <CompWrap>
      <h1>DashBoard</h1>
    </CompWrap>

    <CompWrap>
      <CreateBill />
    </CompWrap>

    <CompWrap>
      <button onClick={getAss}> Get Your Bills</button>
    </CompWrap>

    <CompWrap>
      {bills.map((bill) => {
        return (
          <TestBill
          key={bill.id}
          amount={bill.amount}
          creditor={bill.creditor}
          description={bill.description}
          due={bill.due}/>
        );
      })}
    </CompWrap>

     <CompWrap>
      <button onClick={getLoan}> Get Loans Made</button>
     </CompWrap>

    <CompWrap>
    {loans.map((loan) => {
      return (
      <CreatedBill
        key={loan.id}
        id = {loan.id}
        amount={loan.amount}
        creditor={loan.creditor}
        debtor={loan.debtor}
        description={loan.description}
        due={loan.due}/>
      );
    })}
    </CompWrap>
    </DashWrap>
  </div>
    );
}

export default Dash;
