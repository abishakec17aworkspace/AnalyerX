import React from 'react'
import { Route, Routes } from 'react-router-dom'
import LandingPage from './Pages/LandingPage'
import ProtecetedRoute from './component/ProtecetedRoute'
import Dashboard from './Pages/Dashboard'
import LoginPage from './Pages/LoginPage'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<LandingPage/>}/>
      <Route path='/Login' element={<LoginPage/>}/>

      <Route element={<ProtecetedRoute/>}>
          <Route path='/Dashboard' element={<Dashboard/>}/>
      </Route>
    </Routes>
  )
}

export default App
