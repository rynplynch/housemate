import * as React from "react";

const bills = (props) => {

    return (
      <div className="Bills">
        <h1>{props.id}</h1>
         <h2>
          {props.creditor}
         </h2>
         <h2>
          {props.debtor}
         </h2>
         <h2>
          {props.amount}
         </h2>
         <h2>
          {props.paid}
         </h2>
         <h2>
          {props.body}
         </h2>
         <h2>
           {props.due}
         </h2>
      </div>
    )
}

export default bills;
