import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Register from './../components/roommate/Register'

const REG_URL = '/register';
const LOG_URL = '/login';



function HomePage() {
  // declare state variables to hold user inputs
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [name, setName] = useState('');

  //navigator that redirects to new page
  const navigate = useNavigate();

  //event handlers for user input
  const inEmail = (event) => {
    setEmail(event.target.value);
  };
  const inPass = (event) => {
    setPass(event.target.value);
  };
  const inName = (event) => {
    setName(event.target.value);
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
    //if the POST us successful then reroute to dashboard
      .then( response => {
        if (response.status == 200) navigate('/dash')
      })
      .catch(e => console.log(e));

  }

  //handle register POST
  const regUser = () => {
    fetch(REG_URL, {
      method: 'POST',
      body: JSON.stringify({
        "name": name,
        "email": email,
        "password": pass
      })
    })
    //if the POST then alert user
      .then( response => {
        if (response.status == 200) alert("USER REGISTERED!");
      })
      .catch(e => console.log(e));
  }

  return (
    <>
      <Register email={email} inEmail={inEmail} pass={pass} inPass={inPass} name={name} inName={inName}/>
      <button onClick={logUser}>Login User</button>
      <button onClick={regUser}>Register New User</button>
    </>
  );}

export default HomePage;
