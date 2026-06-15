import type { PostReaction } from '../services/communityService'

interface Props {
  postId: number
  reactions: PostReaction[]
  onAddReaction: (postId: number, emoji: string) => Promise<void>
  onRemoveReaction: (postId: number, emoji: string) => Promise<void>
  isLoading?: boolean
}

const AVAILABLE_EMOJIS = ['❤️', '🔥', '🎮', '😎', '⚔️']

export default function ReactionBar({
  postId,
  reactions,
  onAddReaction,
  onRemoveReaction,
  isLoading
}: Props) {
  const handleReactionClick = async (emoji: string) => {
    const reaction = reactions.find(r => r.emoji === emoji)
    if (reaction?.user_reacted) {
      await onRemoveReaction(postId, emoji)
    } else {
      await onAddReaction(postId, emoji)
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {AVAILABLE_EMOJIS.map(emoji => {
        const reaction = reactions.find(r => r.emoji === emoji)
        const userReacted = reaction?.user_reacted || false
        const count = reaction?.count || 0

        return (
          <button
            key={emoji}
            onClick={() => handleReactionClick(emoji)}
            disabled={isLoading}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              userReacted
                ? 'bg-gaming-accent/30 border border-gaming-accent text-gaming-accent'
                : 'bg-gaming-surface/50 border border-gaming-accent/20 text-gaming-secondary hover:border-gaming-accent/50'
            }`}
          >
            <span className="text-lg">{emoji}</span>
            {count > 0 && <span className="text-xs font-bold">{count}</span>}
          </button>
        )
      })}
    </div>
  )
}
