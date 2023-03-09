import React, { useState } from 'react';
import {PropTypes} from 'prop-types';

function PaymentForm({postPay, id}) {
  const [amount, setAmount] = useState("");

  const handleSubmit = e => {
    e.preventDefault()
    postPay(amount, id);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>amount</label>
      <input
        name="amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input type="submit" value="Submit"/>
    </form>
  )
}

//validation of prop types
PaymentForm.propTypes = {
  postPay: PropTypes.func,
  id: PropTypes.string
}

export default PaymentForm;
