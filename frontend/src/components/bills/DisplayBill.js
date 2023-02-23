import React, {} from 'react';
import PropTypes from 'prop-types';


const DisplayBills = (props) => {

  return (
    <div>
      <h2> AMOUNT: {props.amount}</h2>
    <h2> CREDITOR: {props.creditor}</h2>
    <h2> DESCRIPTION: {props.description}</h2>
    <h2> DUE: {props.due}</h2>
    </div>
  )
}

//validation of prop types
DisplayBills.propTypes = {
  amount: PropTypes.string,
  creditor: PropTypes.number,
  description: PropTypes.string,
  due: PropTypes.string
}

export default DisplayBills;
