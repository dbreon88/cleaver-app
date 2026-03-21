export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase-server'
import { PostCard } from '@/components/PostCard'

export default async function FeedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: posts } = await supabase
    .from('posts')
    .select(`*, author:users!author_id(*), likes(count), comments(count)`)
    .order('created_at', { ascending: false })
    .limit(20)

  let likedPostIds = new Set<string>()
  let savedPostIds = new Set<string>()
  if (user) {
    const [likesRes, savesRes] = await Promise.all([
      supabase.from('likes').select('post_id').eq('user_id', user.id),
      supabase.from('saves').select('post_id').eq('user_id', user.id),
    ])
    likedPostIds = new Set(likesRes.data?.map(l => l.post_id) || [])
    savedPostIds = new Set(savesRes.data?.map(s => s.post_id) || [])
  }

  const enrichedPosts = (posts || []).map(post => ({
    ...post,
    author: post.author,
    like_count: post.likes?.[0]?.count ?? 0,
    comment_count: post.comments?.[0]?.count ?? 0,
    liked_by_user: likedPostIds.has(post.id),
    saved_by_user: savedPostIds.has(post.id),
  }))

  return (
    <main>
      <header className="sticky top-0 z-40 border-b border-blade-border bg-blade-bg px-4 py-3">
        <h1 className="text-2xl font-black tracking-wider text-white">CLEAVER</h1>
      </header>
      {enrichedPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-blade-steel">
          <p className="text-lg">No posts yet</p>
          <p className="text-sm">The blade awaits its first cut.</p>
        </div>
      ) : (
        enrichedPosts.map(post => <PostCard key={post.id} post={post} />)
      )}
    </main>
  )
}
