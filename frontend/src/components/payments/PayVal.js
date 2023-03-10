import React, {} from 'react'
import PropTypes from 'prop-types'

const PayVal = ({amount, valPay, id, state}) => {
  const handleApprove = (e) => {
    e.preventDefault
    valPay(id, true)
  }
  const handleDeny = (e) => {
    e.preventDefault
    valPay(id, false)
  }
   // <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
 return (
   <div style={{display: "flex", justifyContent: "space-between", maxHeight: "100px"}}>
   <p style={{textAlign: "left"}}>
     ${amount}
   </p>
   <p style={{textAlign: "left"}}>
     STATE: {state}
   </p>
   <button onClick={handleApprove} style={{maxHeight: "10vh"}} >APPROVE</button>
   <button onClick={handleDeny} style={{maxHeight: "10vh"}} >DENY</button>
   </div>
 )
}

PayVal.propTypes = {
  amount: PropTypes.string,
  state: PropTypes.number,
  id: PropTypes.string,
  valPay: PropTypes.func
}

export default PayVal
