import Bills from '../components/bills/Bills'
import React, {} from 'react'
function Dash() {
  const bill = {
    id: "1",
    amount: "50",
    creditor: "Ryan",
    description: "WATER BILL",
    date: new Date(),
    diffTime: 50,
    payments: [{}]
  }
  const bill0 = {
    id: "2",
    amount: "50",
    creditor: "Ryan",
    description: "WATER BILL",
    date: new Date(),
    diffTime: 50,
    payments: [{}]
  }

  const payment = {
    id: "1",
    bill: "1",
    amount : "50"
  }
  const payment0 = {
    id: "2",
    bill: "2",
    amount : "50"
  }
  const bills = [bill,bill0]
  const mates = [{}]
  const payments = [payment,payment0]

  const postPay = (amount, id) => {
    console.log(amount),
    console.log(id)
  }

  const delPay = (billID, payID) => {
    console.log(billID)
    console.log(payID)
  }

  return (
    <div>
      <Bills bills={bills} mates={mates} payments = {payments} postPay = {postPay} delPay={delPay}/>
    </div>
    );
}

export default Dash;
