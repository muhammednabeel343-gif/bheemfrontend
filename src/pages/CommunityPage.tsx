import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import {
  getFeed,
  createPost,
  deletePost,
  addReaction,
  removeReaction,
  addComment,
  deleteComment,
  getGamesForAttachment,
  type CommunityPost,
  type Comment,
} from '../services/communityService'
import CreatePostCard from '../components/CreatePostCard'
import CommunityPostCard from '../components/CommunityPostCard'
import { MessageSquare, Loader } from 'lucide-react'

export default function CommunityPage() {
  const { token, user } = useAuth()
  const navigate = useNavigate()

  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [games, setGames] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [postingError, setPostingError] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  const loadFeed = useCallback(async () => {
    if (!token) return

    try {
      const feed = await getFeed(token, 50, 0)
      setPosts(feed.posts)
      setError('')
    } catch (err) {
      setError('Failed to load community feed')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [token])

  const loadGames = useCallback(
    async (search: string = '') => {
      if (!token) return

      try {
        const result = await getGamesForAttachment(token, search, 20)
        setGames(result.games || [])
      } catch (err) {
        console.error('Failed to load games', err)
      }
    },
    [token]
  )

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }

    loadFeed()
    loadGames()

    // Auto-refresh feed every 30 seconds
    const interval = setInterval(() => {
      loadFeed()
    }, 30000)

    return () => clearInterval(interval)
  }, [token, navigate, loadFeed, loadGames])

  const handleCreatePost = async (content: string, gameId?: number) => {
    if (!token) return

    try {
      setPostingError('')
      const newPost = await createPost(token, content, gameId)
      setPosts([newPost, ...posts])
    } catch (err) {
      setPostingError('Failed to create post')
    }
  }

  const handleDeletePost = async (postId: number) => {
    if (!token) return

    try {
      await deletePost(token, postId)
      setPosts(posts.filter(p => p.id !== postId))
    } catch (err) {
      alert('Failed to delete post')
    }
  }

  const handleAddReaction = async (postId: number, emoji: string) => {
    if (!token) return

    try {
      await addReaction(token, postId, emoji)
      // Reload feed to get updated reactions
      loadFeed()
    } catch (err) {
      console.error('Failed to add reaction', err)
    }
  }

  const handleRemoveReaction = async (postId: number, emoji: string) => {
    if (!token) return

    try {
      await removeReaction(token, postId, emoji)
      // Reload feed to get updated reactions
      loadFeed()
    } catch (err) {
      console.error('Failed to remove reaction', err)
    }
  }

  const handleAddComment = async (postId: number, comment: string) => {
    if (!token) return

    try {
      const newComment = await addComment(token, postId, comment)
      // Update post comments
      setPosts(
        posts.map(p =>
          p.id === postId
            ? {
                ...p,
                comments: [...p.comments, newComment],
                comment_count: p.comment_count + 1,
              }
            : p
        )
      )
    } catch (err) {
      alert('Failed to add comment')
    }
  }

  const handleDeleteComment = async (commentId: number) => {
    if (!token) return

    try {
      await deleteComment(token, commentId)
      // Update posts to remove comment
      setPosts(
        posts.map(p => ({
          ...p,
          comments: p.comments.filter(c => c.id !== commentId),
          comment_count: p.comment_count - 1,
        }))
      )
    } catch (err) {
      alert('Failed to delete comment')
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gaming-bg flex items-center justify-center">
        <div className="text-center">
          <MessageSquare size={64} className="text-gaming-secondary/50 mx-auto mb-4" />
          <p className="text-xl text-gaming-secondary mb-4">Please login to access the community</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 rounded-lg bg-gaming-accent text-white font-bold hover:bg-gaming-accent/90"
          >
            Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gaming-bg">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <MessageSquare size={32} />
            Gaming Community
          </h1>
          <p className="text-gaming-secondary">
            Share your gaming moments, reactions, and connect with other players
          </p>
        </div>

        {/* Errors */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-status-not-recommended/20 border border-status-not-recommended text-status-not-recommended">
            {error}
          </div>
        )}

        {postingError && (
          <div className="mb-6 p-4 rounded-lg bg-status-not-recommended/20 border border-status-not-recommended text-status-not-recommended">
            {postingError}
          </div>
        )}

        {/* Create Post Card */}
        <CreatePostCard onPost={handleCreatePost} games={games} onLoadGames={loadGames} />

        {/* Refresh button */}
        <div className="mb-6 text-center">
          <button
            onClick={async () => {
              setRefreshing(true)
              await loadFeed()
            }}
            disabled={refreshing}
            className="text-gaming-secondary hover:text-gaming-accent transition-colors disabled:opacity-50 flex items-center gap-2 mx-auto"
          >
            {refreshing ? (
              <>
                <Loader size={16} className="animate-spin" />
                Refreshing...
              </>
            ) : (
              'Refresh Feed'
            )}
          </button>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-center py-16">
            <Loader size={48} className="text-gaming-accent mx-auto animate-spin mb-4" />
            <p className="text-gaming-secondary">Loading community feed...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <MessageSquare size={64} className="text-gaming-secondary/50 mx-auto mb-4" />
            <p className="text-xl text-gaming-secondary mb-4">No posts yet. Be the first to share!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map(post => (
              <CommunityPostCard
                key={post.id}
                post={post}
                currentUserId={user.id}
                onDelete={handleDeletePost}
                onAddReaction={handleAddReaction}
                onRemoveReaction={handleRemoveReaction}
                onAddComment={handleAddComment}
                onDeleteComment={handleDeleteComment}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
