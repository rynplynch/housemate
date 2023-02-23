import React, {useState} from 'react';
import DisplayBills from './components/bills/DisplayBill'
import {useForm} from 'react-hook-form'
// import CreateBill from './components/bills/CreateBill'
import { useNavigate } from 'react-router-dom';

//endpoints for backend
//not sure if these will work in production
//so putting them here for easy changing
const ASS_URL = '/assigned';
const BILL_URL = '/bill';

function Dash() {
  //setting state for used variables
  const [bills,setBills] = useState([]);

  //setting state for bill creation
  // const [debtor, setDebtor] = useState(0);
  // const [amount, setAmount] = useState('');
  // const [desc, setDesc] = useState('');
  // const [due, setDue] = useState('');

  //navigator that redirects to new page
  const navigate = useNavigate();

  //GET assigned
  const getAss= () => {
    fetch(ASS_URL, {
      credentials: 'include'
    })
      .then( response => response.json() )
      .then( data => {
        // if(!data.bills==null)
          setBills(data.bills);
        console.log(data.bills);
      });
  }

  // const dummyBill = {
  //   "debtor": 2,
  //   "amount": "50",
  //   "description": "a test bill",
  //   "due": "2023-02-26T07:27:19.252518Z"
  // }
  //POST bill
  // logout by moving back to homepage TODO: new endpoint which deletes cookie
  const logout = () => {
    navigate('/')
  }

  //handlers for user input on bill creation
  // const inDebtor = (event) => {
  //   setDebtor(event.target.value)
  // }
  // const inAmount = () => {
  //   setAmount(event.target.value)
  // }
  // const inDesc = () => {
  //   setDesc(event.target.value)
  // }
  // const inDue= () => {
  //   setDue(event.target.value)
  // }
  const { register, handleSubmit } = useForm();
  const handleRegistration = (data) => {
    fetch(BILL_URL, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(data)
    })
 }
  return (
    <div>
      <button onClick={logout}>Logout</button>
      <h1>WORKING DEMO</h1>

    <form onSubmit={handleSubmit(handleRegistration)}>
      <div>
        <label>debtor</label>
        <input type="number" name="debtor" {...register('debtor', {
          valueAsNumber: true,
        })} />
      </div>
      <div>
        <label>amount</label>
        <input  name="amount" {...register('amount')} />
      </div>
      <div>
        <label>description</label>
        <input name="description" {...register('description')} />
      </div>
      <div>
        <label>due</label>
        <input  name="due" {...register('due')} />
      </div>
      <button>Submit</button>
    </form>

      {/* <CreateBill debtor={debtor} inDebtor={inDebtor} */}
      {/*             amount={amount} inAmount={inAmount} */}
      {/*             desc={desc} inDesc={inDesc} */}
      {/*             due={due} inDue={inDue}/> */}
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
