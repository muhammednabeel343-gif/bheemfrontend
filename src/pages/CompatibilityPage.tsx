import { useEffect, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getCompatibilityReport } from '../services/systemService'
import CompatibilityReport from '../components/CompatibilityReport'

function CompatibilityPage() {
  const { gameId } = useParams()
  const { token } = useAuth()
  const location = useLocation()

  const game = location.state?.game
  const simulatorReport = location.state?.report

  const [report, setReport] = useState<any>(null)
  const [loading, setLoading] = useState(true)

useEffect(() => {

  if (simulatorReport) {
    setReport(simulatorReport)
    setLoading(false)
    return
  }

  const loadReport = async () => {
    try {
      if (!token || !gameId) return

      const data = await getCompatibilityReport(
        token,
        Number(gameId)
      )

      setReport(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  loadReport()

}, [token, gameId, simulatorReport])

  if (loading) {
    return (
      <div className="p-8 text-center">
        Loading compatibility report...
      </div>
    )
  }

  if (!report) {
    return (
      <div className="p-8 text-center">
        Report not found.
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">

    <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6">
  <h1 className="text-3xl font-bold text-slate-900">
    {game?.name || `Game #${gameId}`}
  </h1>

  <p className="mt-2 text-lg text-slate-600">
    {game?.genre}
  </p>

  
</div>
      <CompatibilityReport report={report} />
    </div>
  )
}

export default CompatibilityPage