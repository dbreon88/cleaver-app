import { createClient } from '@/lib/supabase-server'
import { UserAvatar } from '@/components/UserAvatar'
import { PostGrid } from '@/components/PostGrid'
import { ProfileActions } from './ProfileActions'
import { notFound } from 'next/navigation'
import type { Post } from '@/lib/types'

export default async function ProfilePage({ params }: { params: { username: string } }) {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()

  const { data: profile } = await supabase.from('users').select('*').eq('username', params.username).single()
  if (!profile) return notFound()

  const [followersRes, followingRes] = await Promise.all([
    supabase.from('follows').select('id', { count: 'exact', head: true }).eq('following_id', profile.id),
    supabase.from('follows').select('id', { count: 'exact', head: true }).eq('follower_id', profile.id),
  ])

  let isFollowing = false
  const isOwnProfile = authUser?.id === profile.id
  if (authUser && !isOwnProfile) {
    const { data } = await supabase.from('follows').select('id').eq('follower_id', authUser.id).eq('following_id', profile.id).single()
    isFollowing = !!data
  }

  let posts: Post[] = []
  if (profile.role === 'admin') {
    const { data } = await supabase.from('posts').select('*').eq('author_id', profile.id).order('created_at', { ascending: false })
    posts = data || []
  }

  let savedPosts: Post[] = []
  if (isOwnProfile) {
    const { data: saves } = await supabase.from('saves').select('post_id, posts(*)').eq('user_id', profile.id).order('created_at', { ascending: false })
    savedPosts = (saves || []).map((s: any) => s.posts).filter(Boolean)
  }

  return (
    <main>
      <header className="sticky top-0 z-40 border-b border-blade-border bg-blade-bg px-4 py-3">
        <h1 className="text-lg font-bold text-white">{profile.username}</h1>
      </header>
      <div className="flex items-center gap-6 px-6 py-6">
        <UserAvatar src={profile.avatar_url} username={profile.username} size={80} />
        <div className="flex flex-1 justify-around text-center">
          {profile.role === 'admin' && (
            <div><p className="font-bold text-white">{posts.length}</p><p className="text-xs text-blade-steel">Posts</p></div>
          )}
          <div><p className="font-bold text-white">{followersRes.count ?? 0}</p><p className="text-xs text-blade-steel">Followers</p></div>
          <div><p className="font-bold text-white">{followingRes.count ?? 0}</p><p className="text-xs text-blade-steel">Following</p></div>
        </div>
      </div>
      {profile.bio && <p className="px-6 pb-4 text-sm text-blade-silver">{profile.bio}</p>}
      <ProfileActions profileId={profile.id} isOwnProfile={isOwnProfile} isFollowing={isFollowing} />
      {profile.role === 'admin' && <PostGrid posts={posts} />}
      {isOwnProfile && savedPosts.length > 0 && (
        <>
          <h2 className="border-t border-blade-border px-4 py-3 text-sm font-semibold text-blade-steel">Saved</h2>
          <PostGrid posts={savedPosts} />
        </>
      )}
    </main>
  )
}
