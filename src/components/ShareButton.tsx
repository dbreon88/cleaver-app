'use client'
interface ShareButtonProps { postId: string }
export function ShareButton({ postId }: ShareButtonProps) {
  async function handleShare() {
    const url = `${window.location.origin}/post/${postId}`
    if (navigator.share) { await navigator.share({ title: 'CLEAVER', url }) }
    else { await navigator.clipboard.writeText(url) }
  }
  return (
    <button onClick={handleShare} aria-label="Share" className="text-xl text-blade-steel transition hover:text-white">📤</button>
  )
}
