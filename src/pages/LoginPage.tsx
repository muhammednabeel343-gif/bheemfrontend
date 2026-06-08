import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import GameReadyLogo from '../components/GameReadyLogo'

function LoginPage() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signIn({ email, password })
    } catch (err: any) {
      const detail = err?.response?.data?.detail || err?.message || 'Login failed'
      setError(detail)
    } finally {
      setLoading(false)
    }
  }
return (

<div className="relative min-h-screen bg-[#020617] flex items-center justify-center px-6 overflow-hidden">
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.12),transparent_60%)]" />
    <div className="relative z-10 w-full max-w-md">

     

      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur">
        <div className="mb-3 flex justify-center">
          <GameReadyLogo variant="compact" />
        </div>
        <p className="mb-8 text-center text-lg text-slate-400">
          Measure Your PC. Match Your Games.
        </p>
        {error && (
          <div className="mb-5 rounded-xl bg-red-500/20 border border-red-500/30 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-medium text-slate-200">
              Email
            </span>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-300">
              Password
            </span>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-violet-600 px-4 py-3 font-semibold text-white transition hover:bg-violet-500 disabled:opacity-70"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          New here?{' '}
          <Link
            to="/register"
            className="font-semibold text-violet-400 hover:text-violet-300"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  </div>
)
  
}

export default LoginPage