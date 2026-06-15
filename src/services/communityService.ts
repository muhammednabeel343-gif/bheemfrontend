const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

export interface PostReaction {
  emoji: string
  count: number
  user_reacted: boolean
}

export interface Comment {
  id: number
  user_id: number
  username: string
  comment: string
  created_at: string
}

export interface CommunityPost {
  id: number
  user_id: number
  username: string
  content: string
  game_id?: number
  game_name?: string
  game_image_url?: string
  created_at: string
  reactions: PostReaction[]
  comments: Comment[]
  comment_count: number
}

export interface CommunityFeed {
  posts: CommunityPost[]
  total_count: number
}

export async function getFeed(token: string, limit: number = 50, offset: number = 0): Promise<CommunityFeed> {
  const response = await fetch(`${API_BASE_URL}/community/feed?limit=${limit}&offset=${offset}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch community feed')
  }

  return response.json()
}

export async function createPost(token: string, content: string, gameId?: number): Promise<CommunityPost> {
  const response = await fetch(`${API_BASE_URL}/community/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      content,
      game_id: gameId,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to create post')
  }

  return response.json()
}

export async function deletePost(token: string, postId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/community/posts/${postId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to delete post')
  }
}

export async function addReaction(token: string, postId: number, emoji: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/community/posts/${postId}/reactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ emoji }),
  })

  if (!response.ok) {
    throw new Error('Failed to add reaction')
  }
}

export async function removeReaction(token: string, postId: number, emoji: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/community/posts/${postId}/reactions/${emoji}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to remove reaction')
  }
}

export async function addComment(token: string, postId: number, comment: string): Promise<Comment> {
  const response = await fetch(`${API_BASE_URL}/community/posts/${postId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ comment }),
  })

  if (!response.ok) {
    throw new Error('Failed to add comment')
  }

  return response.json()
}

export async function deleteComment(token: string, commentId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/community/comments/${commentId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to delete comment')
  }
}

export async function getGamesForAttachment(token: string, search?: string, limit: number = 20): Promise<any> {
  let url = `${API_BASE_URL}/community/games/list?limit=${limit}`
  if (search) {
    url += `&search=${encodeURIComponent(search)}`
  }

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch games')
  }

  return response.json()
}
