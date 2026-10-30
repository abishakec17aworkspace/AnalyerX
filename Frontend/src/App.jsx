
import React from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
} from 'react-router-dom'

import Navbar from './Components/Navbar'
import InterfacePage from './Pages/InterfacePage'
import DatasetOverview from './Components/DatasetOverview'
import DataModule from './Components/datamodule'
import Charts from './Components/charts'
import LandingPage from './Pages/LandingPage'
import Layout from './Components/Layout'

// Shared layout for all workspace pages
const WorkspaceLayout = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-950">
      <Navbar />

      <main className="relative min-w-0 flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}

const PlaceholderPage = ({ title }) => (
  <div className="min-h-full p-8 text-white">
    <h1 className="text-3xl font-bold">{title}</h1>
    <p className="mt-3 text-gray-400">
      Your {title.toLowerCase()} page content will appear here.
    </p>
  </div>
)

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Welcome page without sidebar */}
        <Route path="/" element={<LandingPage />} />

        {/* Workspace pages share the same sidebar */}
        <Route element={<Layout/>}>
          <Route path="/Interface" element={<InterfacePage />} />
          <Route path="/Dashboard" element={<DatasetOverview />} />
          <Route
            path="/Charts"
            element={<Charts/>}
          />
          <Route
            path="/Report"
            element={<PlaceholderPage title="Report" />}
          />
          <Route
            path="/Data"
            element={<DataModule/>}
          />
          <Route
            path="/Profile"
            element={<PlaceholderPage title="Profile" />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
