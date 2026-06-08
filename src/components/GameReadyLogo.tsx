import { Gamepad2 } from 'lucide-react'

interface GameReadyLogoProps {
  variant?: 'full' | 'compact'
}

function GameReadyLogo({ variant = 'full' }: GameReadyLogoProps) {
  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-1">
        <Gamepad2 className="h-10 w-10 text-violet-500" />
        <span className="text-3xl font-bold text-violet-500">GameReady</span>
      </div>
    )
  }

  return (
    <div className="text-center">
      <Gamepad2 className="mx-auto mb-3 h-12 w-12 text-violet-500" />
      <h1 className="text-4xl font-bold text-violet-500">
        GameReady
      </h1>
      <p className="mt-1 text-sm text-slate-400">
        Measure Your PC. Match Your Games.
      </p>
    </div>
  )
}

export default GameReadyLogo
