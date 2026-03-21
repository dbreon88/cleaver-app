'use client'
interface LikeButtonProps { liked: boolean; count: number; onToggle: () => void }
export function LikeButton({ liked, count, onToggle }: LikeButtonProps) {
  return (
    <button onClick={onToggle} aria-label={liked ? 'Unlike' : 'Like'}
      className={`flex items-center gap-1 transition-transform active:scale-125 ${liked ? 'text-blade-red' : 'text-blade-silver'}`}>
      <span className="text-xl">🔪</span>
      <span className="text-sm">{count}</span>
    </button>
  )
}
