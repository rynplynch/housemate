import React, { useEffect, useState} from 'react';
import ToRender from '../components/household/toRender'

//endpoints for backend
const HOUSE_URL = 'household/'

function HousePage() {

  const [house,setHouse] = useState(null);


  // POST a new bill using data from BillForm
  const postHouse = (name) => {
    fetch(HOUSE_URL, {
      method: 'POST',
      credentials: 'include',
      // body: JSON.stringify(data)
      body: JSON.stringify({
        name: name
      })
    })
      .then(res => {
        if (res.status == 200) {
          getHouse()
        }
      })
      .catch(e => alert(e))
  }

  const getHouse = () =>{
    fetch(HOUSE_URL, {
      credentials: 'include'
    })
      .then( response => response.json() )
      .then( data => {
        if(data.household!=null){
          console.log(data.household)
          setHouse(data.household)
        }
        // console.log("Household: ", data.household)
      })
      .catch( e => console.log(e) )
  }

  //calls api when the application first mounts
  useEffect( () => {
    getHouse()
  }, [])

  return (
    <div>
      <ToRender house={house} postHouse={postHouse}/>
    </div>
    );
}


export default HousePage;
