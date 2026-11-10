import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtecetedRoute = () => {
const {isAuthenticated} = useAuth()
  return isAuthenticated 
  ?<Outlet/>
  :<Navigate to="/Login" replace/>
    
}

export default ProtecetedRoute

