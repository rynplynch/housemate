import React, {} from 'react';
import {Card, Title, Date, Description} from './Loan.style'
import PropTypes from 'prop-types';


const Loan = ({ id, amount, debtor, description, due, diffTime, deleteLoan}) => {

  const handleClick = e => {
    e.preventDefault()
    deleteLoan(id)
  }


  return (
    <Card>
      <Title>{debtor}, owes you</Title>
      <Date >They have till: {due.toDateString()}</Date>
      <Date>Days till due: {diffTime}</Date>
      <Description>Amount: {amount}</Description>
      <Description>Desciption: {description}</Description>
      <button onClick={handleClick}>DELETE LOAN</button>
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
