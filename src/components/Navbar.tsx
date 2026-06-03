import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function Navbar() {
  const { user, signOut } = useAuth()

  return (
    <header className="border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <nav className="flex items-center gap-4 text-slate-700">
          <Link to="/" className="font-semibold text-slate-900 hover:text-slate-700">
            Library
          </Link>
          <Link to="/favorites" className="text-slate-600 hover:text-slate-900">
            Favorites
          </Link>
         
          <Link to="/simulator" className="text-slate-600 hover:text-slate-900">
    Simulator
  </Link>
        </nav>
        <div className="flex items-center gap-4 text-slate-700">
          <span className="text-sm text-slate-500">{user?.username}</span>
          <button
            onClick={signOut}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
