import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Listbox } from '@headlessui/react'
import { getGames } from '../services/gameService'
import { useNavigate } from 'react-router-dom'
import { simulateCompatibility, getCpuOptions, getGpuOptions, getRamOptions, getStorageOptions } from '../services/systemService'

function SystemSimulatorPage() {
  const { token } = useAuth()
  const navigate = useNavigate()

  const [cpus, setCpus] = useState<any[]>([])
  const [gpus, setGpus] = useState<any[]>([])
  const [rams, setRams] = useState<any[]>([])
  const [storages, setStorages] = useState<any[]>([])
  const [report, setReport] = useState<any>(null)

  const [cpu, setCpu] = useState('')
  const [gpu, setGpu] = useState('')
  const [ram, setRam] = useState<number | null>(null)
  const [storage, setStorage] = useState(250)

  const [games, setGames] = useState<any[]>([])
  const [selectedGame, setSelectedGame] = useState<any>(null)

  useEffect(() => {
    if (!token) return

    const loadHardware = async () => {
      try {
        const [cpuData, gpuData, ramData, storageData] = await Promise.all([
          getCpuOptions(token),
          getGpuOptions(token),
          getRamOptions(token),
          getStorageOptions(token),
        ])

        setCpus(cpuData)
        setGpus(gpuData)
        setRams(ramData)
        setStorages(storageData)
        const gamesData = await getGames(token)
        setGames(gamesData.games)
      } catch (error) {
        console.error(error)
      }
    }

    loadHardware()
  }, [token])

  const scanSimulator = async () => {
    if (!cpu) {
      alert('Please select a CPU')
      return
    }

    if (!gpu) {
      alert('Please select a GPU')
      return
    }

    if (!ram) {
      alert('Please select RAM')
      return
    }

    if (!selectedGame) {
      alert('Please select a game')
      return
    }

    try {
      const result = await simulateCompatibility(
        token!,
        {
          game_id: selectedGame.id,
          cpu,
          gpu,
          ram_gb: ram,
          storage_gb: storage,
        }
      )

      setReport(result)

      navigate(
        `/compatibility/${selectedGame.id}`,
        {
          state: {
            report: result,
            game: selectedGame,
          },
        }
      )
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">PC Compatibility Simulator</h1>
        <button
          type="button"
          onClick={scanSimulator}
          className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Scan Compatibility
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <h2 className="mb-6 text-xl font-semibold">Custom PC Specs</h2>

          <div className="space-y-4">
            <Listbox value={cpu} onChange={setCpu}>
              <div className="relative">
                <Listbox.Button className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-left">
                  {cpu || 'Select CPU'}
                </Listbox.Button>
                <Listbox.Options className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-2xl border border-slate-200 bg-white shadow-lg">
                  {cpus.length === 0 ? (
                    <div className="px-4 py-3 text-slate-500">No CPUs added yet</div>
                  ) : (
                    cpus.map((item) => (
                      <Listbox.Option
                        key={item.name}
                        value={item.name}
                        className="cursor-pointer px-4 py-3 hover:bg-slate-100"
                      >
                        {item.name}
                      </Listbox.Option>
                    ))
                  )}
                </Listbox.Options>
              </div>
            </Listbox>

            <Listbox value={gpu} onChange={setGpu}>
              <div className="relative">
                <Listbox.Button className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-left">
                  {gpu || 'Select GPU'}
                </Listbox.Button>
                <Listbox.Options className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-2xl border border-slate-200 bg-white shadow-lg">
                  {gpus.length === 0 ? (
                    <div className="px-4 py-3 text-slate-500">No GPUs added yet</div>
                  ) : (
                    gpus.map((item) => (
                      <Listbox.Option
                        key={item.name}
                        value={item.name}
                        className="cursor-pointer px-4 py-3 hover:bg-slate-100"
                      >
                        {item.name}
                      </Listbox.Option>
                    ))
                  )}
                </Listbox.Options>
              </div>
            </Listbox>

            <Listbox value={ram} onChange={setRam}>
              <div className="relative">
                <Listbox.Button className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-left">
                  {ram ? `${ram} GB RAM` : 'Select RAM'}
                </Listbox.Button>
                <Listbox.Options className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-2xl border border-slate-200 bg-white shadow-lg">
                  {rams.length === 0 ? (
                    <div className="px-4 py-3 text-slate-500">No RAM options added yet</div>
                  ) : (
                    rams.map((item) => (
                      <Listbox.Option
                        key={item.value}
                        value={item.value}
                        className="cursor-pointer px-4 py-3 hover:bg-slate-100"
                      >
                        {item.label}
                      </Listbox.Option>
                    ))
                  )}
                </Listbox.Options>
              </div>
            </Listbox>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Free Storage: {storage} GB
              </label>
              <input
                type="range"
                min="0"
                max="500"
                step="10"
                value={storage}
                onChange={(e) => setStorage(Number(e.target.value))}
                className="w-full cursor-pointer"
              />
              <div className="mt-1 flex justify-between text-xs text-slate-500">
                <span>0 GB</span>
                <span>250 GB</span>
                <span>500 GB</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <h2 className="mb-6 text-xl font-semibold">Select Game</h2>

          {games.length === 0 ? (
            <div className="text-slate-500">No games added yet</div>
          ) : (
            <>
              <select
                className="mb-6 w-full rounded-2xl border p-3"
                onChange={(e) => {
                  const game = games.find(
                    (g) => String(g.id) === e.target.value
                  )
                  setSelectedGame(game)
                }}
              >
                <option value="">Select Game</option>
                {games.map((game) => (
                  <option key={game.id} value={game.id}>
                    {game.name}
                  </option>
                ))}
              </select>

              {selectedGame && (
                <div className="mt-6 flex items-center gap-6 rounded-3xl border border-slate-200 p-4">
                  <img
                    src={selectedGame.image_url}
                    alt={selectedGame.name}
                    onError={(e) => { (e.target as HTMLImageElement).src = '' }}
                    className="h-40 w-28 rounded-2xl object-cover bg-slate-100"
                  />
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">
                      {selectedGame.name}
                    </h3>
                    <p className="mt-2 text-lg text-slate-500">
                      {selectedGame.genre}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default SystemSimulatorPage