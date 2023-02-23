import React, {} from 'react';
import PropTypes from 'prop-types';

function Register(props) {

  return (
    <div>
      <div>Username:</div>
      <input value={props.name} onChange={props.inName} />
      <div>User Email:</div>
      <input value={props.email} onChange={props.inEmail} />
      <div>User Password:</div>
      <input value={props.pass} onChange={props.inPass} />
    </div>
  )
}

// validation of prop types
Register.propTypes = {
  email: PropTypes.string,
  pass: PropTypes.string,
  name: PropTypes.string,
  inEmail: PropTypes.func,
  inPass: PropTypes.func,
  inName: PropTypes.func
}

export default Register;
