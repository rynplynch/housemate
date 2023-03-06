import React, {  } from 'react'
import Bill from './Bill'
import PropTypes from 'prop-types'

const Bills = ({bills}) => {
  return (
    <div>
        {/* interate through the bills array */}
        {/* each bill has its value assigned to the components props */}
        {bills.map((bill) => {
        return (
            <Bill
            key={bill.id}
            id = {bill.id}
            amount={bill.amount}
            creditor={bill.creditor}
            description={bill.description}
            due={bill.due}
            />
        );
        })}
    </div>
  )
}

Bills.propTypes = {
  bills: PropTypes.array,
  getAss: PropTypes.func
}

export default Bills
