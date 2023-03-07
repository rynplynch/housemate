import React, {  } from 'react'
import Bill from './Bill'
import PropTypes from 'prop-types'

const Bills = ({bills, mates}) => {
  return (
    <div>
        {/* interate through the bills array */}
        {/* each bill has its value assigned to the components props */}
        {bills.map((bill) => {
            const dateDue = new Date(bill.due)
            const today = new Date()
            const diffTime = Math.ceil((dateDue-today)/(1000*60*60*24))
            var name = ""
            mates.map((mate) => {
                if(bill.creditor === mate.id) name = mate.name
            })
            return (
                <Bill
                key={bill.id}
                id = {bill.id}
                amount={bill.amount}
                creditor={name}
                description={bill.description}
                date={dateDue}
                diffTime={diffTime}
                />
            );
        })}
    </div>
  )
}

Bills.propTypes = {
  bills: PropTypes.array,
    mates: PropTypes.array
}

export default Bills
