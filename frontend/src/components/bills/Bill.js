import React, { } from 'react';
import {Card, Title, Date, Description} from './Bill.style'
import PropTypes from 'prop-types';


const Bill = (props) => {
  return (
    <Card>
    <Title>{props.description} </Title>
    <Date>{props.due}</Date>
      <Description>Amount: {props.amount}</Description>
      <Description>Debtor: {props.creditor}</Description>
    </Card>
  )
}

//validation of prop types
Bill.propTypes = {
  id: PropTypes.number,
  amount: PropTypes.string,
  creditor: PropTypes.number,
  description: PropTypes.string,
  due: PropTypes.string
}

export default Bill;
