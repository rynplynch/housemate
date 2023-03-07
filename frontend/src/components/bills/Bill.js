import React, { } from 'react';
import {Card, Title, Date, Description} from './Bill.style'
import PropTypes from 'prop-types';


const Bill = (props) => {
  return (
    <Card>
      <Title>You owe: {props.creditor}</Title>
      <Date>You have till: {props.date.toDateString()}</Date>
      <Date>Days till due: {props.diffTime}</Date>
      <Description>Amount: {props.amount}</Description>
      <Description>Desciption: {props.description}</Description>
    </Card>
  )
}

//validation of prop types
Bill.propTypes = {
  id: PropTypes.number,
  amount: PropTypes.string,
  creditor: PropTypes.string,
  description: PropTypes.string,
  date: PropTypes.object,
  diffTime: PropTypes.number
}

export default Bill;
