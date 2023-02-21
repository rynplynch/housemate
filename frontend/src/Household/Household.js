import * as React from "react";
import Bills from "../Bills/Bills"


class Household extends React.Component{

  state ={
    household: {name: 'Household Name'},
    bills:[{
      id: 1,
      creditor: 'Creditor',
      debtor: 'Debtor',
      amount: 'Amount',
      paid: 'Paid',
      description: 'Description',
      due: 'Dec, 2nd'
    }
           ]
  }

  render () {
      const i = 0;
    const bills = this.state.bills.map((d) => d.amount);
    return (
      <div className="Household">
        <h1>{this.state.household.name}</h1>
        <Bills
          id={this.state.bills[i].id}
          creditor={this.state.bills[i].creditor}
          debtor={this.state.bills[i].debtor}
          amount={this.state.bills[i].amount}
          paid={this.state.bills[i].paid}
          description={this.state.bills[i].body}
          due={this.state.bills[i].due}/>
      </div>
    )
  };
}

export default Household;
