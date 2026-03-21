'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { useAuth } from '@/components/AuthProvider'
import { UserAvatar } from '@/components/UserAvatar'

export default function SettingsPage() {
  const { user } = useAuth()
  const supabase = createClient()
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (user) { setUsername(user.username); setBio(user.bio || '') }
  }, [user])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setSaving(true); setError(''); setSuccess(false)

    let avatar_url = user.avatar_url
    if (avatarFile) {
      const ext = avatarFile.name.split('.').pop()
      const path = `avatars/${user.id}.${ext}`
      const { error: uploadError } = await supabase.storage.from('avatars').upload(path, avatarFile, { upsert: true })
      if (uploadError) { setError('Failed to upload avatar'); setSaving(false); return }
      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path)
      avatar_url = urlData.publicUrl
    }

    const { error: updateError } = await supabase.from('users').update({ username, bio: bio || null, avatar_url }).eq('id', user.id)
    if (updateError) {
      setError(updateError.code === '23505' ? 'Username already taken' : 'Something went wrong')
    } else { setSuccess(true) }
    setSaving(false)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!user) return null

  return (
    <main>
      <header className="sticky top-0 z-40 border-b border-blade-border bg-blade-bg px-4 py-3">
        <h1 className="text-lg font-bold text-white">Edit Profile</h1>
      </header>
      <form onSubmit={handleSave} className="flex flex-col gap-4 px-6 py-6">
        <div className="flex justify-center">
          <UserAvatar src={user.avatar_url} username={user.username} size={80} />
        </div>
        <label className="text-blade-steel text-sm">
          Change profile picture
          <input type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
            className="mt-1 block w-full text-sm text-blade-steel" />
        </label>
        <input type="text" placeholder="Username" value={username}
          onChange={(e) => setUsername(e.target.value)} required maxLength={30}
          className="rounded-lg border border-blade-border bg-blade-surface px-4 py-3 text-white placeholder-blade-steel focus:border-blade-red focus:outline-none" />
        <textarea placeholder="Bio" value={bio} onChange={(e) => setBio(e.target.value)} maxLength={150} rows={3}
          className="rounded-lg border border-blade-border bg-blade-surface px-4 py-3 text-white placeholder-blade-steel focus:border-blade-red focus:outline-none" />
        {error && <p className="text-blade-red text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">Profile updated!</p>}
        <button type="submit" disabled={saving}
          className="rounded-lg bg-blade-red py-3 font-semibold text-white transition hover:bg-blade-red-dim disabled:opacity-50">
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button type="button" onClick={handleSignOut}
          className="rounded-lg border border-blade-border py-3 text-sm font-semibold text-blade-steel transition hover:text-white">
          Sign Out
        </button>
      </form>
    </main>
  )
}
