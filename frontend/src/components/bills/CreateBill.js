import React, {} from 'react';
import {useForm} from 'react-hook-form';
import Style, {} from 'styled-components';
import moment from 'moment';

const BILL_URL = '/bill';
function CreateBill() {

  const { register, handleSubmit } = useForm();
  const postBill = (data) => {
    fetch(BILL_URL, {
      method: 'POST',
      credentials: 'include',
      // body: JSON.stringify(data)
      body: JSON.stringify({
        amount: data.amount,
        debtor: data.debtor,
        description: data.description,
        due: moment().toISOString(data.due)
      })

    })
      .then(response => console.log(response))
 }

const Wrapper = Style.section`
padding: 1em;
background-color: #22313f ;
border-radius: 5px;
`
  return (
    <Wrapper>
    <form onSubmit={handleSubmit(postBill)}>
      <h1> Bill Creation </h1>
      <div>
        <label>debtor</label>
        <input type="number" name="debtor" {...register('debtor', {
          valueAsNumber: true,
        })}/>
      </div>
      <div>
        <label>amount</label>
        <input  name="amount" {...register('amount')} />
      </div>
      <div>
        <label>description</label>
        <input name="description" {...register('description')} />
      </div>
      <div>
        <label>due</label>
        <input type="datetime-local" name="due" {...register('due')} />
      </div>
      <button>Submit</button>
    </form>
    </Wrapper>
  )
}


export default CreateBill;
