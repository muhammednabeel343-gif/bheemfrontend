import { useState } from 'react'
import { Send, Trash2 } from 'lucide-react'
import type { Comment } from '../services/communityService'

interface Props {
  postId: number
  comments: Comment[]
  currentUserId: number
  onAddComment: (postId: number, comment: string) => Promise<void>
  onDeleteComment: (commentId: number) => Promise<void>
  isLoading?: boolean
}

export default function CommentSection({
  postId,
  comments,
  currentUserId,
  onAddComment,
  onDeleteComment,
  isLoading
}: Props) {
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return

    setSubmitting(true)
    try {
      await onAddComment(postId, newComment)
      setNewComment('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-4 border-t border-gaming-accent/20 pt-4">
      {/* Existing Comments */}
      <div className="space-y-3 max-h-48 overflow-y-auto">
        {comments.length === 0 ? (
          <p className="text-gaming-secondary text-sm text-center py-4">No comments yet. Be the first!</p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="flex gap-3">
              <div className="flex-1 p-2 rounded-lg bg-gaming-surface/50">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-white text-sm">{comment.username}</p>
                  {comment.user_id === currentUserId && (
                    <button
                      onClick={() => onDeleteComment(comment.id)}
                      className="p-1 rounded hover:bg-status-not-recommended/20 transition-colors"
                    >
                      <Trash2 size={14} className="text-status-not-recommended" />
                    </button>
                  )}
                </div>
                <p className="text-gaming-secondary text-xs mt-1">
                  {new Date(comment.created_at).toLocaleDateString('en-IN')}
                </p>
                <p className="text-white text-sm mt-2">{comment.comment}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Comment */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSubmitComment()
            }
          }}
          placeholder="Add a comment..."
          className="flex-1 px-3 py-2 rounded-lg bg-gaming-surface border border-gaming-accent/20 text-white placeholder-gaming-secondary focus:outline-none focus:border-gaming-accent transition-colors"
          disabled={submitting || isLoading}
        />
        <button
          onClick={handleSubmitComment}
          disabled={submitting || isLoading || !newComment.trim()}
          className="p-2 rounded-lg bg-gaming-accent text-white hover:bg-gaming-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  )
}
