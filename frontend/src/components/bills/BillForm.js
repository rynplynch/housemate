import React, {} from 'react';
import {PropTypes} from 'prop-types';

function BillForm({debtor, setDebtor, amount, setAmount, desc, setDesc, due, setDue, postBill}) {
  const handleSubmit = e => {
    e.preventDefault()
    postBill();
  }
  return (
    <form onSubmit={handleSubmit}>
      <h2> Bill Creation </h2>
      <label>debtor</label>
      <input
        type="number"
        name="debtor"
        value={debtor}
        onChange={(e) => {
          const temp = parseInt(e.target.value)
          if (!isNaN(temp))
            setDebtor(temp)
        }}
      />
      <label>amount</label>
      <input
        name="amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <label>description</label>
      <input
        name="description"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />
      <label>due</label>
      <input
        type="datetime-local"
        name="due"
        value={due}
        onChange={(e) => setDue(e.target.value)}
      />
      <input type="submit" value="Submit"/>
    </form>
  )
}

//validation of prop types
BillForm.propTypes = {
  debtor: PropTypes.number,
  setDebtor: PropTypes.func,
  amount: PropTypes.string,
  setAmount: PropTypes.func,
  desc: PropTypes.string,
  setDesc: PropTypes.func,
  due: PropTypes.string,
  setDue: PropTypes.func,
  postBill: PropTypes.func
}

export default BillForm;
