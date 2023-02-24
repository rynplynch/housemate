import React, {  } from 'react';
import styled, {} from 'styled-components';
import PropTypes from 'prop-types';


const CreatedBill = (props) => {
  const Card = styled.div`
border: 1px solid black;
border-radius: 5px;
background-color: #8dc6ff;
padding: 5px;
margin: 5px;
`
    const Title = styled.h2`
    color: #fff;
    font-weight: 300;
    `
  const Date = styled.div`
    color: #fcc;
    font-weight: 300;
    margin: 6px 0;
    `
  const Description = styled.p`
    color: #fff;
    font-weight: 300;
    `

  const rmBill = () => {
    fetch(`/bill/${props.id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
      .then( response => {
        if(response.status == 200)
          alert('Bill Deleted')
      })
      .catch( e => console.log(e) )
    }


  return (
    <Card>
    <Title>{props.description} </Title>
    <Date>{props.due}</Date>
      <Description>Amount: {props.amount}</Description>
      <Description>Debtor: {props.debtor}</Description>
      <button onClick={rmBill}>DELETE</button>
    </Card>
    // <Card style={{width: '18rem'}} bg='light' key={props.id}>
    // <ListGroup>
    //   <ListGroupItem> {props.description} </ListGroupItem>
    //   <ListGroupItem> AMOUNT: {props.amount}</ListGroupItem>
    // <ListGroupItem> CREDITOR: {props.creditor}</ListGroupItem>
    // <ListGroupItem> DUE: {props.due}</ListGroupItem>
    // </ListGroup>
    // </Card>
  )
}

//validation of prop types
CreatedBill.propTypes = {
  id: PropTypes.number,
  amount: PropTypes.string,
  creditor: PropTypes.number,
  debtor: PropTypes.number,
  description: PropTypes.string,
  due: PropTypes.string
}

export default CreatedBill;
