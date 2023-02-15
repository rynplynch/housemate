import * as React from "react";
import Bills from "../Bills/Bills"


class Household extends React.Component{

  state ={
    household: {name: 'Household Name'},
    bills:{
      id: 1,
      creditor: 'Creditor',
      debtor: 'Debtor',
      amount: 'Amount',
      paid: 'Paid',
      description: 'Description',
      due: 'Dec, 2nd'
    }
  }

  render () {
    return (
      <div className="Household">
        <h1>{this.state.household.name}</h1>
        <Bills
          id={this.state.bills.id}
          creditor={this.state.bills.creditor}
          debtor={this.state.bills.debtor}
          amount={this.state.bills.amount}
          paid={this.state.bills.paid}
          description={this.state.bills.body}
          due={this.state.bills.due}/>
      </div>
    )
  };
}

export default Household;
