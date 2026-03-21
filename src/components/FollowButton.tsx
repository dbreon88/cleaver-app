'use client'
interface FollowButtonProps { following: boolean; onToggle: () => void }
export function FollowButton({ following, onToggle }: FollowButtonProps) {
  return (
    <button onClick={onToggle} aria-label={following ? 'Unfollow' : 'Follow'}
      className={`rounded-lg px-6 py-1.5 text-sm font-semibold transition ${
        following ? 'border border-blade-border bg-transparent text-blade-silver' : 'bg-blade-red text-white'
      }`}>
      {following ? 'Following' : 'Follow'}
    </button>
  )
}
