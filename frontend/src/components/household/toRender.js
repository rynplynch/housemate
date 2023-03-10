import React, {  } from 'react'
import PropTypes from 'prop-types';
import HouseForm from './HouseForm'
import Dashboard from '../../pages/Dashboard'


const ToRender = (props) => {

  //return true if the house exists
  const hasHouse = () => {
    return props.house !== null;
  }

  if(hasHouse()) {
    return <Dashboard />
  }
  return <HouseForm postHouse={props.postHouse} />

}

ToRender.propTypes = {
  getHouse: PropTypes.func,
  house: PropTypes.string,
  postHouse: PropTypes.func
}

export default ToRender
