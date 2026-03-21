'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'

export default function OnboardingPage() {
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    let avatar_url: string | null = null
    if (avatarFile) {
      const ext = avatarFile.name.split('.').pop()
      const path = `avatars/${user.id}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, avatarFile, { upsert: true })
      if (uploadError) {
        setError('Failed to upload avatar')
        setLoading(false)
        return
      }
      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path)
      avatar_url = urlData.publicUrl
    }

    const { error: insertError } = await supabase.from('users').insert({
      id: user.id,
      email: user.email!,
      username,
      bio: bio || null,
      avatar_url,
    })

    if (insertError) {
      if (insertError.code === '23505') {
        setError('Username already taken')
      } else {
        setError('Something went wrong')
      }
      setLoading(false)
      return
    }

    router.push('/')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <h1 className="mb-8 text-3xl font-bold text-white">Set up your profile</h1>
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
        <input type="text" placeholder="Username" value={username}
          onChange={(e) => setUsername(e.target.value)} required maxLength={30}
          className="rounded-lg border border-blade-border bg-blade-surface px-4 py-3 text-white placeholder-blade-steel focus:border-blade-red focus:outline-none"
        />
        <textarea placeholder="Bio (optional)" value={bio}
          onChange={(e) => setBio(e.target.value)} maxLength={150} rows={3}
          className="rounded-lg border border-blade-border bg-blade-surface px-4 py-3 text-white placeholder-blade-steel focus:border-blade-red focus:outline-none"
        />
        <label className="text-blade-steel">
          Profile picture (optional)
          <input type="file" accept="image/*"
            onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
            className="mt-1 block w-full text-sm text-blade-steel"
          />
        </label>
        {error && <p className="text-blade-red text-sm">{error}</p>}
        <button type="submit" disabled={loading || !username}
          className="rounded-lg bg-blade-red py-3 font-semibold text-white transition hover:bg-blade-red-dim disabled:opacity-50"
        >
          {loading ? 'Setting up...' : 'Get Started'}
        </button>
      </form>
    </div>
  )
}
