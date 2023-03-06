import React, { } from 'react'
import Loan from './Loan'
import PropTypes from 'prop-types'

const Loans = ({loans, deleteLoan}) => {
  return (
    <div>
        {/* interate through the loans array */}
        {/* each loan has its value assigned to the components props */}
        {loans.map((loan, index) => {
        return (
            <Loan
              key={index}
              id = {loan.id}
              amount={loan.amount}
              creditor={loan.creditor}
              debtor={loan.debtor}
              description={loan.description}
              due={loan.due}
              deleteLoan={deleteLoan}
            />
        );
        })}
    </div>
  )
}

Loans.propTypes = {
  loans: PropTypes.array,
  deleteLoan: PropTypes.func
}

export default Loans
