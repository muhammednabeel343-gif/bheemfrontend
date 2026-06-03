import { useAuth } from '../contexts/AuthContext'

function HomePage() {
  const { user, signOut } = useAuth()

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-12">
      <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-md">
        <h1 className="mb-4 text-3xl font-semibold">Welcome back, {user?.username}!</h1>
        <p className="mb-6 text-slate-600">
          Your email is <strong>{user?.email}</strong>.
        </p>
        <button
          onClick={signOut}
          className="rounded-xl bg-slate-900 px-5 py-3 text-white transition hover:bg-slate-700"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default HomePage
