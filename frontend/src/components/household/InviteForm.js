import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {PropTypes} from 'prop-types';

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
    <div>
    <h1>INVITE A ROOMMATE</h1>
    <form onSubmit={handleSubmit}>
      <label>Name of HouseHold</label>
      <input
        name="name"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input type="submit" value="Submit"/>
    </form>
      <button onClick={goToLogin}>Go to login</button>
    </div>
  )
}

//validation of prop types
InviteForm.propTypes = {
  postInv: PropTypes.func
}

export default InviteForm;
