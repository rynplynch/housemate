import React, {} from 'react';
import {Card, Title, Date, Description} from './Bill.style'
import PropTypes from 'prop-types';
import Payments from '../payments/Payments'


const Bill = (props) => {
  return (
    <Card >
      <Title>You owe: {props.creditor}</Title>
      <Date>You have till: {props.date.toDateString()}</Date>
      <Date>Days till due: {props.diffTime}</Date>
      <Description>Amount: {props.amount}</Description>
      <Description>Desciption: {props.description}</Description>
      <Payments payments={props.payments} id={props.id} postPay={props.postPay} delPay={props.delPay}/>
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
  payments: PropTypes.array,
  postPay: PropTypes.func,
  delPay: PropTypes.func
}

export default Bill;
