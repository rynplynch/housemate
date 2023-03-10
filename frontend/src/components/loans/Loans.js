import React, { } from 'react'
import Loan from './Loan'
import PropTypes from 'prop-types'
import {Cards} from './Loans.style'

const Loans = ({loans, mates, deleteLoan}) => {
  return (
          <Cards>
        {/* interate through the loans array */}
        {/* each loan has its value assigned to the components props */}
        {loans.map((loan, index) => {
            const dateDue = new Date(loan.due)
            const today = new Date()
            const diffTime = Math.ceil((dateDue-today)/(1000*60*60*24))
            var name = "HELLO"
            mates.map((mate) => {
                if(loan.debtor === mate.id) name = mate.name
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
          </Cards>
  )
}

Loans.propTypes = {
  loans: PropTypes.array,
  mates: PropTypes.array,
  deleteLoan: PropTypes.func
}

export default Loans
