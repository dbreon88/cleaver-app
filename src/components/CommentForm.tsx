'use client'
import { useState } from 'react'

interface CommentFormProps { onSubmit: (body: string) => void }

export function CommentForm({ onSubmit }: CommentFormProps) {
  const [body, setBody] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!body.trim()) return
    onSubmit(body.trim())
    setBody('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 border-t border-blade-border px-4 py-3">
      <input type="text" placeholder="Add a comment..." value={body}
        onChange={(e) => setBody(e.target.value)} maxLength={500}
        className="flex-1 bg-transparent text-white placeholder-blade-steel focus:outline-none" />
      <button type="submit" aria-label="Post comment" disabled={!body.trim()}
        className="font-semibold text-blade-red disabled:opacity-30">Post</button>
    </form>
  )
}
