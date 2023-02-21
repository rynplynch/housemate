import * as React from "react";
import Card from 'react-bootstrap/Card';

const bills = (props) => {

    return (
      <Card>
        <Card.Body>
          <Card.Title>{props.id}</Card.Title>
          <Card.Body>{props.creditor}</Card.Body>
          <Card.Body>{props.debtor}</Card.Body>
          <Card.Body>{props.amount}</Card.Body>
          <Card.Body>{props.paid}</Card.Body>
          <Card.Body>{props.description}</Card.Body>
          <Card.Body>{props.due}</Card.Body>
        </Card.Body>
      </Card>
    );
}

export default bills;
