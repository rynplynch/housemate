import React, {useState, useEffect} from 'react';
import {Card, Title, Date, Description} from './Loan.style'
import PropTypes from 'prop-types';
import PaysVal from '../payments/PaysVal'

const PAY_URL = 'payments/'

const Loan = ({ id, amount, debtor, description, due, diffTime, deleteLoan}) => {

  const [payments,setPayments] = useState([]);

  const getPay = () => {
    fetch(PAY_URL+id, {
      credentials: 'include'
    })
      .then( response =>response.json())
      .then( data => {
        console.log(data)
        if(data.payments!=null)
          setPayments([...data.payments]);
        if(data.payments == null) setPayments([]);
        // console.log("Roommates: ",data.roommates)
      })
      .catch( e => console.log(e) )
  }

  const valPay = (payID, valid) => {
    fetch(PAY_URL+'validate', {
      method: 'POST',
      credentials: 'include',
      // body: JSON.stringify(data)
      body: JSON.stringify({
        bill: id,
        id: payID,
        valid: valid
      })
    })
      .then(res => {
        if (res.status == 200) {
          getPay()
        }
      })
      .catch(e => alert(e))
  }

  const handleClick = e => {
    e.preventDefault()
    deleteLoan(id)
  }

  useEffect( () => {
    getPay()
  }, [] )

  return (
    <Card>
      <Title>{debtor}, owes you</Title>
      <Date >They have till: {due.toDateString()}</Date>
      <Date>Days till due: {diffTime}</Date>
      <Description>Amount: {amount}</Description>
      <Description>Desciption: {description}</Description>
      <button onClick={handleClick}>DELETE LOAN</button>
      <PaysVal payments={payments} valPay={valPay}/>
    </Card>
  )
}

//validation of prop types
Loan.propTypes = {
  id: PropTypes.string,
  amount: PropTypes.string,
  debtor: PropTypes.string,
  description: PropTypes.string,
  due: PropTypes.object,
  BILL_URL: PropTypes.string,
  diffTime: PropTypes.number,
  deleteLoan: PropTypes.func
}

export default Loan;
