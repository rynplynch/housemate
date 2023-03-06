import React, {} from 'react';
import {Card, Title, Date, Description} from './Loan.style'
import PropTypes from 'prop-types';


const Loan = ({ id, amount, debtor, description, due, deleteLoan}) => {

  const handleClick = e => {
    e.preventDefault()
    console.log("DELETE?")
    deleteLoan(id)
  }


  return (
    <Card>
    <Title>{description} </Title>
    <Date>{due}</Date>
      <Description>Amount: {amount}</Description>
      <Description>Debtor: {debtor}</Description>
      <button onClick={handleClick}>DELETE</button>
    </Card>
  )
}

//validation of prop types
Loan.propTypes = {
  id: PropTypes.number,
  amount: PropTypes.string,
  debtor: PropTypes.number,
  description: PropTypes.string,
  due: PropTypes.string,
  BILL_URL: PropTypes.string,
  deleteLoan: PropTypes.func
}

export default Loan;
