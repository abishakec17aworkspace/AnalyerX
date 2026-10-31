import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import {
  LayoutDashboard,
  ChartNoAxesColumn,
  FileText,
  Database,
  UserRound,
  PanelLeftClose,
  PanelLeftOpen,
  HomeIcon,
  BrushCleaningIcon,
  ScanLine
} from 'lucide-react'

const Navbar = () => {
  const [collapsed, setCollapsed] = useState(true)

  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    { name: 'Interface', path: '/Interface', icon: HomeIcon },
    { name: 'Dashboard', path: '/Dashboard', icon: LayoutDashboard },
    { name: 'Data', path: '/Data', icon: Database },
    { name: 'Charts', path: '/Charts', icon: ChartNoAxesColumn },
    { name: 'Report', path: '/Report', icon: FileText },
    { name: 'Clean', path: '/CleaningPage', icon: ScanLine },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <aside
      className={`h-screen shrink-0 ${
        collapsed ? 'w-20' : 'w-72'
      } bg-black/40 backdrop-blur-xl border-r border-blue-500/40
      shadow-2xl text-white flex flex-col
      transition-[width] duration-500 ease-in-out`}
    >
      {/* Logo and Toggle */}
      <div className="flex items-center justify-between p-5 border-b border-white/10">
        {!collapsed && (
          <h1 className="text-xl font-bold text-blue-400 whitespace-nowrap">
            Analyxer X
          </h1>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-white/10 transition"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <PanelLeftOpen size={21} />
          ) : (
            <PanelLeftClose size={21} />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6">
        {!collapsed && (
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-4 px-3">
            Workspace
          </p>
        )}

        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)

            return (
              <li key={item.name}>
                <button
                  onClick={() => navigate(item.path)}
                  title={collapsed ? item.name : ''}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl
                    transition-all duration-300 ease-in-out
                    ${
                      active
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }
                    ${collapsed ? 'justify-center' : ''}`}
                >
                  <Icon size={21} />

                  {!collapsed && (
                    <span className="font-medium">{item.name}</span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Profile */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={() => navigate('/Profile')}
          className={`w-full flex items-center gap-3 p-3 rounded-xl
            transition-all duration-300 ease-in-out
            ${
              isActive('/Profile')
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-white/10 hover:text-white'
            }
            ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Profile' : ''}
        >
          <UserRound size={21} />

          {!collapsed && (
            <div className="text-left">
              <p className="font-medium">Profile</p>
              <p className="text-xs text-gray-400">Account settings</p>
            </div>
          )}
        </button>
      </div>
    </aside>
  )
}

export default Navbar
