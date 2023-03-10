import React, { } from 'react'
import Loan from './Loan'
import PropTypes from 'prop-types'

const Loans = ({loans, mates, deleteLoan}) => {
  return (
    <div>
        {/* interate through the loans array */}
        {/* each loan has its value assigned to the components props */}
        {loans.map((loan, index) => {
            const dateDue = new Date(loan.due)
            const today = new Date()
            const diffTime = Math.ceil((dateDue-today)/(1000*60*60*24))
            var name = "HELLO"
          console.log(mates)
          console.log(loan)
            mates.map((mate) => {
              console.log(mate.name)
                if(loan.id === mate.id) name = mate.name
            })
        return (
            <Loan
              key={index}
              id = {loan.id}
              amount={loan.amount}
              creditor={loan.creditor}
              debtor={name}
              description={loan.description}
              due={dateDue}
              diffTime={diffTime}
              deleteLoan={deleteLoan}
            />
        );
        })}
    </div>
  )
}

Loans.propTypes = {
  loans: PropTypes.array,
  mates: PropTypes.array,
  deleteLoan: PropTypes.func
}

export default Loans
