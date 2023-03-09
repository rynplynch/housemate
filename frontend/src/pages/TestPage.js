import Bills from '../components/bills/Bills'
import React, {} from 'react'


function Dash() {
  const bills = [{},{},{},{},{}]
  const mates = [{}]
  return (
    <div>
      <Bills bills={bills} mates={mates}/>
    </div>
    );
}

export default Dash;
