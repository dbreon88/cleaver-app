'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-browser'
import { useAuth } from '@/components/AuthProvider'
import { FollowButton } from '@/components/FollowButton'

interface ProfileActionsProps { profileId: string; isOwnProfile: boolean; isFollowing: boolean }

export function ProfileActions({ profileId, isOwnProfile, isFollowing: initialFollowing }: ProfileActionsProps) {
  const { user } = useAuth()
  const supabase = createClient()
  const router = useRouter()
  const [following, setFollowing] = useState(initialFollowing)

  async function toggleFollow() {
    if (!user) return
    if (following) {
      await supabase.from('follows').delete().eq('follower_id', user.id).eq('following_id', profileId)
      setFollowing(false)
    } else {
      await supabase.from('follows').insert({ follower_id: user.id, following_id: profileId })
      setFollowing(true)
    }
    router.refresh()
  }

  if (isOwnProfile) {
    return (
      <div className="px-6 pb-4">
        <Link href="/settings" className="block w-full rounded-lg border border-blade-border py-1.5 text-center text-sm font-semibold text-blade-silver">
          Edit Profile
        </Link>
      </div>
    )
  }

  return (
    <div className="flex gap-2 px-6 pb-4">
      <FollowButton following={following} onToggle={toggleFollow} />
      <Link href={`/messages/${profileId}`}
        className="rounded-lg border border-blade-border px-6 py-1.5 text-sm font-semibold text-blade-silver">
        Message
      </Link>
    </div>
  )
}
