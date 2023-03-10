import React, { useState } from 'react';
import {PropTypes} from 'prop-types';

const HouseForm = ({postHouse}) => {
  const [name, setName] = useState("");



  const handleSubmit = e => {
    e.preventDefault()
    postHouse(name);
  }

  return (
    <div>
    <h1>CREATE A NEW HOUSEHOLD</h1>
    <h3>or wait for an invite</h3>
    <form onSubmit={handleSubmit}>
      <label>Name of HouseHold</label>
      <input
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input type="submit" value="Submit"/>
    </form>
      <button href='/login'>Go to Dashboard</button>
    </div>
  )
}

//validation of prop types
HouseForm.propTypes = {
  postHouse: PropTypes.func
}

export default HouseForm;
