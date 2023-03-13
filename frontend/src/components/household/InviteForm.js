import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {PropTypes} from 'prop-types';
import {Card, Title} from './InviteForm.style'

const InviteForm = ({postInv}) => {
  const [email, setEmail] = useState("");


  const navigate = useNavigate();
  const goToLogin = (event) => {
    event.preventDefault
    navigate('/login')
  }

  const handleSubmit = e => {
    e.preventDefault()
    postInv(email);
  }

  return (
    <Card>
    <Title>INVITE A ROOMMATE</Title>
    <form onSubmit={handleSubmit}>
      <label>Enter email of user you want to invite</label>
      <input
        name="name"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input type="submit" value="Submit"/>
    </form>
      <button onClick={goToLogin}>Go to login</button>
    </Card>
  )
}

//validation of prop types
InviteForm.propTypes = {
  postInv: PropTypes.func
}

export default InviteForm;
