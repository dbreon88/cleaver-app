export type UserRole = 'admin' | 'user'

export interface User {
  id: string
  email: string
  username: string
  display_name: string | null
  bio: string | null
  avatar_url: string | null
  role: UserRole
  created_at: string
}

export interface Post {
  id: string
  author_id: string
  image_url: string
  caption: string | null
  created_at: string
  author?: User
  like_count?: number
  comment_count?: number
  liked_by_user?: boolean
  saved_by_user?: boolean
}

export interface Like {
  id: string
  user_id: string
  post_id: string
  created_at: string
}

export interface Comment {
  id: string
  user_id: string
  post_id: string
  body: string
  created_at: string
  user?: User
}

export interface Follow {
  id: string
  follower_id: string
  following_id: string
  created_at: string
}

export interface Save {
  id: string
  user_id: string
  post_id: string
  created_at: string
}

export interface Message {
  id: string
  sender_id: string
  recipient_id: string
  body: string
  read: boolean
  created_at: string
  sender?: User
  recipient?: User
}

export interface Conversation {
  user: User
  last_message: Message
  unread_count: number
}
