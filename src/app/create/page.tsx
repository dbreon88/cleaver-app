'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { useAuth } from '@/components/AuthProvider'

export default function CreatePostPage() {
  const { user, isAdmin } = useAuth()
  const supabase = createClient()
  const router = useRouter()
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [caption, setCaption] = useState('')
  const [posting, setPosting] = useState(false)
  const [error, setError] = useState('')

  if (!isAdmin) {
    return (<main className="flex min-h-screen items-center justify-center">
      <p className="text-blade-steel">Only admins can create posts.</p>
    </main>)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) { setImageFile(file); setPreview(URL.createObjectURL(file)) }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!imageFile || !user) return
    setPosting(true); setError('')

    const ext = imageFile.name.split('.').pop()
    const path = `posts/${crypto.randomUUID()}.${ext}`
    const { error: uploadError } = await supabase.storage.from('posts').upload(path, imageFile)
    if (uploadError) { setError('Failed to upload image'); setPosting(false); return }

    const { data: urlData } = supabase.storage.from('posts').getPublicUrl(path)
    const { error: insertError } = await supabase.from('posts').insert({
      author_id: user.id, image_url: urlData.publicUrl, caption: caption || null,
    })
    if (insertError) { setError('Failed to create post'); setPosting(false); return }
    router.push('/')
  }

  return (
    <main>
      <header className="sticky top-0 z-40 border-b border-blade-border bg-blade-bg px-4 py-3">
        <h1 className="text-lg font-bold text-white">New Post</h1>
      </header>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 py-6">
        {preview ? (
          <img src={preview} alt="Preview" className="aspect-square w-full rounded-lg object-cover" />
        ) : (
          <label className="flex aspect-square w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-blade-border text-blade-steel hover:border-blade-red">
            <span className="text-lg">Tap to select image</span>
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
        )}
        {preview && (
          <button type="button" onClick={() => { setImageFile(null); setPreview(null) }}
            className="text-sm text-blade-steel">Change image</button>
        )}
        <textarea placeholder="Write a caption..." value={caption}
          onChange={(e) => setCaption(e.target.value)} rows={3}
          className="rounded-lg border border-blade-border bg-blade-surface px-4 py-3 text-white placeholder-blade-steel focus:border-blade-red focus:outline-none" />
        {error && <p className="text-blade-red text-sm">{error}</p>}
        <button type="submit" disabled={posting || !imageFile}
          className="rounded-lg bg-blade-red py-3 font-semibold text-white transition hover:bg-blade-red-dim disabled:opacity-50">
          {posting ? 'Posting...' : 'Share'}
        </button>
      </form>
    </main>
  )
}
