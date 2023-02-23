import React, {} from 'react';
import PropTypes from 'prop-types';

function CreateBill(props) {

  return (
    <div>
      <input type="number" value={props.debtor} onChange={props.inDebtor} />
      <div>Amount: </div>
      <input value={props.amount} onChange={props.inAmount} />
      <div>Description of bill: </div>
      <input value={props.desc} onChange={props.inDesc} />
      <div>When its due: </div>
      <input value={props.due} onChange={props.inDue} />
    </div>
  )
}

// validation of prop types
CreateBill.propTypes = {
  debtor: PropTypes.number,
  amount: PropTypes.string,
  desc: PropTypes.string,
  due: PropTypes.string,
  inDebtor: PropTypes.func,
  inAmount: PropTypes.func,
  inDesc: PropTypes.func,
  inDue: PropTypes.func
}

export default CreateBill;
