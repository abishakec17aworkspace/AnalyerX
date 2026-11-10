import React from 'react'
import {useNavigate} from 'react-router-dom'

const LandingPage = () => {
  const navi = useNavigate()
  return (
    <div>
      LandingPage
      <button onClick={()=>{navi('/Login')}}>
        get Started 
      </button>
    </div>
  )
}

export default LandingPage
