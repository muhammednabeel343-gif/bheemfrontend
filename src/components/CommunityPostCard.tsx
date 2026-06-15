import { useState } from 'react'
import { MessageCircle, Trash2 } from 'lucide-react'
import type { CommunityPost, PostReaction, Comment } from '../services/communityService'
import ReactionBar from './ReactionBar'
import CommentSection from './CommentSection'

interface Props {
  post: CommunityPost
  currentUserId: number
  onDelete: (postId: number) => Promise<void>
  onAddReaction: (postId: number, emoji: string) => Promise<void>
  onRemoveReaction: (postId: number, emoji: string) => Promise<void>
  onAddComment: (postId: number, comment: string) => Promise<void>
  onDeleteComment: (commentId: number) => Promise<void>
  isLoading?: boolean
}

export default function CommunityPostCard({
  post,
  currentUserId,
  onDelete,
  onAddReaction,
  onRemoveReaction,
  onAddComment,
  onDeleteComment,
  isLoading
}: Props) {
  const [showComments, setShowComments] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const isAuthor = post.user_id === currentUserId
  const postDate = new Date(post.created_at).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return
    setDeleting(true)
    try {
      await onDelete(post.id)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="p-6 rounded-xl border border-gaming-accent/20 bg-gaming-card/50 backdrop-blur-sm shadow-lg space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="font-bold text-white">{post.username}</p>
          <p className="text-xs text-gaming-secondary">{postDate}</p>
        </div>
        {isAuthor && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-1 rounded hover:bg-status-not-recommended/20 text-status-not-recommended transition-colors disabled:opacity-50"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      {/* Attached Game */}
      {post.game_id && post.game_name && (
        <div className="flex gap-3 p-3 rounded-lg bg-gaming-surface border border-gaming-accent/20">
          {post.game_image_url && (
            <img
              src={post.game_image_url}
              alt={post.game_name}
              className="w-12 h-16 rounded object-cover"
            />
          )}
          <div>
            <p className="text-xs text-gaming-secondary">Featured Game</p>
            <p className="font-bold text-white">{post.game_name}</p>
          </div>
        </div>
      )}

      {/* Content */}
      <p className="text-white whitespace-pre-wrap">{post.content}</p>

      {/* Reactions */}
      <ReactionBar
        postId={post.id}
        reactions={post.reactions}
        onAddReaction={onAddReaction}
        onRemoveReaction={onRemoveReaction}
        isLoading={isLoading}
      />

      {/* Comments Toggle */}
      <button
        onClick={() => setShowComments(!showComments)}
        className="flex items-center gap-2 text-gaming-secondary hover:text-gaming-accent transition-colors"
      >
        <MessageCircle size={16} />
        {post.comment_count} {post.comment_count === 1 ? 'Comment' : 'Comments'}
      </button>

      {/* Comments Section */}
      {showComments && (
        <CommentSection
          postId={post.id}
          comments={post.comments}
          currentUserId={currentUserId}
          onAddComment={onAddComment}
          onDeleteComment={onDeleteComment}
          isLoading={isLoading}
        />
      )}
    </div>
  )
}
