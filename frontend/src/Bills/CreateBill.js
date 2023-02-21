import * as React from "react";
import Card from 'react-bootstrap/Card';

const createbill = (props) => {

    return (
      <Card>
        <Card.Body>
          <Card.Title>{props.id}</Card.Title>
            <h2>{props.creditor}</h2>
            <h2>{props.debtor}</h2>
            <h2>{props.amount}</h2>
            <h2>{props.paid}</h2>
            <h2>{props.body}</h2>
            <h2>{props.due}</h2>
        </Card.Body>
      </Card>
    )
}

export default createbill;
