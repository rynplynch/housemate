import React, {  } from 'react'
import {Cards} from './Bills.style'
import Bill from './Bill'
import PropTypes from 'prop-types'

const Bills = ({bills, mates, payments, postPay, delPay, getAss}) => {
  return (
    <Cards>
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
                payments={payments}
                postPay={postPay}
                  delPay={delPay}
                  getAss={getAss}
                />
            );
        })}
    </Cards>
  )
}

Bills.propTypes = {
    bills: PropTypes.array,
    mates: PropTypes.array,
    payments: PropTypes.array,
    postPay: PropTypes.func,
    delPay: PropTypes.func,
    getAss: PropTypes.func
}

export default Bills
