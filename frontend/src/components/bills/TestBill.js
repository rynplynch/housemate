import React, { } from 'react';
import styled, {} from 'styled-components';
import PropTypes from 'prop-types';


const TestBills = (props) => {
  const Card = styled.div`
border: 1px solid black;
border-radius: 5px;
background-color: #8dc6ff;
padding: 10px;
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
  return (
    <Card>
    <Title>{props.description} </Title>
    <Date>{props.due}</Date>
      <Description>Amount: {props.amount}</Description>
      <Description>Creditor: {props.creditor}</Description>
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
TestBills.propTypes = {
  id: PropTypes.func,
  amount: PropTypes.string,
  creditor: PropTypes.number,
  description: PropTypes.string,
  due: PropTypes.string
}

export default TestBills;
