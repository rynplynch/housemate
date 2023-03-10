import React, {useState, useEffect} from 'react';
import {Card, Title, Date, Description} from './Bill.style'
import PropTypes from 'prop-types';
import Payments from '../payments/Payments'

const PAY_URL = 'payments/'

const Bill = (props) => {

  const [payments,setPayments] = useState([]);
  const getPay = () => {
    fetch(PAY_URL+props.id, {
      credentials: 'include'
    })
      .then( response =>response.json())
      .then( data => {
        if(data.payments!=null)
          setPayments([...data.payments]);
        if(data.payments == null) setPayments([]);
        // console.log("Roommates: ",data.roommates)
      })
      .catch( e => console.log(e) )
  }

  const postPay = (amount) => {
    fetch(PAY_URL, {
      method: 'POST',
      credentials: 'include',
      // body: JSON.stringify(data)
      body: JSON.stringify({
        bill: props.id,
        amount: amount
      })
    })
      .then(res => {
        if (res.status == 200) {
          getPay()
        }
      })
      .catch(e => alert(e))
  }

  const delPay = (id) => {
    fetch(PAY_URL+props.id+'/'+id, {
      method: 'DELETE',
      credentials: 'include',
    })
      .then( response => {
        if(response.status == 200){
          getPay()
        }
      })
      .catch( e => console.log(e) )
  }
  useEffect( () => {
    getPay()
  }, [] )
  return (
    <Card >
      <Title>You owe: {props.creditor}</Title>
      <Date>You have till: {props.date.toDateString()}</Date>
      <Date>Days till due: {props.diffTime}</Date>
      <Description>Amount: {props.amount}</Description>
      <Description>Desciption: {props.description}</Description>
      <Payments payments={payments} id={props.id} postPay={postPay} delPay={delPay}/>
    </Card>
  )
}

//validation of prop types
Bill.propTypes = {
  id: PropTypes.string,
  amount: PropTypes.string,
  creditor: PropTypes.string,
  description: PropTypes.string,
  date: PropTypes.object,
  diffTime: PropTypes.number,
  delPay: PropTypes.func,
  getAss: PropTypes.func
}

export default Bill;
