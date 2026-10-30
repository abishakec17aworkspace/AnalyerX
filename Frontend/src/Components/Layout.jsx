import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

const Layout = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-950">
      <Navbar />

      <main className="relative min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
