import { NavLink, Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <>
      <meta name="author" content="Diego Sevilla" />
      <link rel="author" href="https://diegosevilla.dev/" />
      <meta name="robots" content="index, follow" />
      <meta property="og:site_name" content="CF Static Site" />
      <meta name="theme-color" content="#7c3aed" />
      <main className="min-h-screen flex flex-col max-w-4xl mx-auto px-6">
        <nav className="flex gap-6 py-4 border-b border-gray-200">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? 'text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-900'
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? 'text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-900'
            }
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive ? 'text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-900'
            }
          >
            Contact
          </NavLink>
        </nav>
        <Outlet />
      </main>
    </>
  )
}
