'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { UserAvatar } from '@/components/UserAvatar'
import Link from 'next/link'
import type { User } from '@/lib/types'

export function ExploreSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<User[]>([])
  const supabase = createClient()
  const debounceRef = useRef<NodeJS.Timeout>()

  function handleChange(value: string) {
    setQuery(value)
    clearTimeout(debounceRef.current)
    if (value.length < 2) { setResults([]); return }
    debounceRef.current = setTimeout(async () => {
      const { data } = await supabase.from('users').select('*').ilike('username', `%${value}%`).limit(10)
      setResults(data || [])
    }, 300)
  }

  useEffect(() => () => clearTimeout(debounceRef.current), [])

  return (
    <div className="px-4 py-3">
      <input type="text" placeholder="Search users..." value={query}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full rounded-lg border border-blade-border bg-blade-surface px-4 py-2 text-white placeholder-blade-steel focus:border-blade-red focus:outline-none" />
      {results.length > 0 && (
        <div className="mt-2 rounded-lg border border-blade-border bg-blade-surface">
          {results.map(user => (
            <Link key={user.id} href={`/profile/${user.username}`}
              className="flex items-center gap-3 px-4 py-2 hover:bg-blade-border">
              <UserAvatar src={user.avatar_url} username={user.username} size={32} />
              <div>
                <p className="text-sm font-semibold text-white">{user.username}</p>
                {user.bio && <p className="text-xs text-blade-steel truncate">{user.bio}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
