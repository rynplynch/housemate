import React, { useState } from 'react';
import {PropTypes} from 'prop-types';
import {Card, Title} from './BillForm.style'

function BillForm({amount, setAmount,
                   desc, setDesc, due, setDue, postBill,
                   mates, creditor}) {
  const [debtor, setDebtor] = useState("")
  const handleSubmit = e => {
    e.preventDefault()
    postBill(debtor);
  }
  return (
    <Card>
    <form onSubmit={handleSubmit}>
      <Title> Bill Creation </Title>
      <select
        selected="selected"
        name="debtors"
        id="debtors"
        onChange={(e) => {
          setDebtor(e.target.value)
        }}

      >
        <optgroup label="Roommates">
        {mates.map((mate, i) => {
          if( creditor != mate.id){
            return (
              <option key={i} value={mate.id}> {mate.name} </option>
            );
          }
        })}
    </optgroup>
    </select>
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
    </Card>
  )
}

//validation of prop types
BillForm.propTypes = {
creditor: PropTypes.string,
  amount: PropTypes.string,
  setAmount: PropTypes.func,
  desc: PropTypes.string,
  setDesc: PropTypes.func,
  due: PropTypes.string,
  setDue: PropTypes.func,
  postBill: PropTypes.func,
  mates: PropTypes.array,
}

export default BillForm;
