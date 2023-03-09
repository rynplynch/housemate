import React, {  } from 'react'
import PropTypes from 'prop-types';
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import Payment from './Payment'
import PaymentForm from './PaymentForm'
const Payments = (props) => {
  return (
<div>
      <Accordion>
        <AccordionSummary
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Make a payment</Typography>
        </AccordionSummary>
        <PaymentForm postPay={props.postPay} id={props.id}/>
        <AccordionDetails>
            {props.payments.map((payment, i) => {
            return (
              <Payment amount={payment.amount} key={i} billID={props.id} id={payment.id} delPay={props.delPay}/>
            )
            })}
        </AccordionDetails>
      </Accordion>
    </div>
  )
}

//validation of prop types
Payments.propTypes = {
  payments: PropTypes.array,
  postPay: PropTypes.func,
  delPay: PropTypes.func,
  id: PropTypes.string
}

export default Payments;
