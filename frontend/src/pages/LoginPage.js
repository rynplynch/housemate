import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Register from './../components/roommate/Login'

const LOG_URL = '/login';



function LoginPage() {
  // declare state variables to hold user inputs
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  //navigator that redirects to new page
  const navigate = useNavigate();

  //event handlers for user input
  const inEmail = (event) => {
    setEmail(event.target.value);
  };
  const inPass = (event) => {
    setPass(event.target.value);
  };

  //handle login POST
  const logUser = () => {
    fetch(LOG_URL, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        "email": email,
        "password": pass
      })
    })
    //if the POST is successful then reroute to dashboard
      .then( response => {
        if (response.status == 200) navigate('/house')
      })
      .catch(e => console.log(e));

  }

  const goToReg = (event) => {
    event.preventDefault
    navigate('/register')
  }
  return (
    <div style={{display: "block", margin: "auto", width: "8em"}}>
        <Register email={email} inEmail={inEmail} pass={pass} inPass={inPass}/>
        <button onClick={logUser}>Login User</button>
        <button onClick={goToReg}>Go to user registration</button>
    </div>
  );}

export default LoginPage;
