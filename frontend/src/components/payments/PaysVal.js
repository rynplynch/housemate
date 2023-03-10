import React, {  } from 'react'
import PropTypes from 'prop-types';
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import PayVal from './PayVal'
const PaysVal = (props) => {
  return (
<div>
      <Accordion>
        <AccordionSummary
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Make a payment</Typography>
        </AccordionSummary>
        <AccordionDetails>
            {props.payments.map((payment, i) => {
            return (
              <PayVal valPay={props.valPay} amount={payment.amount} key={i} billID={props.id} id={payment.date} delPay={props.valPay} state={payment.state}/>
            )
            })}
        </AccordionDetails>
      </Accordion>
    </div>
  )
}

//validation of prop types
PaysVal.propTypes = {
  payments: PropTypes.array,
  postPay: PropTypes.func,
  valPay: PropTypes.func,
  id: PropTypes.string
}

export default PaysVal;
