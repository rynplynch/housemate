import React, {} from 'react'
import PropTypes from 'prop-types'

const Payment = ({amount, delPay, billID, id}) => {
  const handleSubmit = (e) => {
    e.preventDefault
    delPay(billID, id)
  }
   // <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
 return (
   <div style={{display: "flex", justifyContent: "space-between", maxHeight: "100px"}}>
   <p style={{textAlign: "left"}}>
     ${amount}
   </p>
   <button onClick={handleSubmit} style={{maxHeight: "10vh"}} >delete</button>
   </div>
 )
}

Payment.propTypes = {
  amount: PropTypes.string,
  billID: PropTypes.string,
  id: PropTypes.string,
  delPay: PropTypes.func
}

export default Payment
