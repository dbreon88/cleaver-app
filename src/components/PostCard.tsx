'use client'
import Link from 'next/link'
import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useAuth } from './AuthProvider'
import { LikeButton } from './LikeButton'
import { SaveButton } from './SaveButton'
import { ShareButton } from './ShareButton'
import { UserAvatar } from './UserAvatar'
import type { Post } from '@/lib/types'

interface PostCardProps { post: Post }
export function PostCard({ post }: PostCardProps) {
  const { user } = useAuth()
  const supabase = createClient()
  const [liked, setLiked] = useState(post.liked_by_user ?? false)
  const [likeCount, setLikeCount] = useState(post.like_count ?? 0)
  const [saved, setSaved] = useState(post.saved_by_user ?? false)

  async function toggleLike() {
    if (!user) return
    if (liked) {
      await supabase.from('likes').delete().eq('user_id', user.id).eq('post_id', post.id)
      setLiked(false); setLikeCount(c => c - 1)
    } else {
      await supabase.from('likes').insert({ user_id: user.id, post_id: post.id })
      setLiked(true); setLikeCount(c => c + 1)
    }
  }

  async function toggleSave() {
    if (!user) return
    if (saved) {
      await supabase.from('saves').delete().eq('user_id', user.id).eq('post_id', post.id)
      setSaved(false)
    } else {
      await supabase.from('saves').insert({ user_id: user.id, post_id: post.id })
      setSaved(true)
    }
  }

  return (
    <article className="border-b border-blade-border">
      <div className="flex items-center gap-3 px-4 py-3">
        <Link href={`/profile/${post.author?.username}`}>
          <UserAvatar src={post.author?.avatar_url ?? null} username={post.author?.username ?? ''} />
        </Link>
        <Link href={`/profile/${post.author?.username}`} className="font-semibold text-white">
          {post.author?.username}
        </Link>
      </div>
      <img src={post.image_url} alt={post.caption || 'Post'} className="aspect-square w-full object-cover" />
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <LikeButton liked={liked} count={likeCount} onToggle={toggleLike} />
          <Link href={`/post/${post.id}`} aria-label="Comments" className="text-xl text-blade-steel">
            💬 <span className="text-sm">{post.comment_count ?? 0}</span>
          </Link>
          <ShareButton postId={post.id} />
        </div>
        <SaveButton saved={saved} onToggle={toggleSave} />
      </div>
      {post.caption && (
        <div className="px-4 pb-3">
          <span className="font-semibold text-white">{post.author?.username}</span>{' '}
          <span className="text-blade-silver">{post.caption}</span>
        </div>
      )}
    </article>
  )
}
