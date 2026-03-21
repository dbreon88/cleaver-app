'use client'

import { createClient } from '@/lib/supabase-browser'

export default function LoginPage() {
  const supabase = createClient()

  async function signInWith(provider: 'google' | 'apple') {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <h1 className="mb-2 text-5xl font-black tracking-wider text-white">
        CLEAVER
      </h1>
      <p className="mb-12 text-blade-steel">The sharpest social network</p>

      <div className="flex w-full flex-col gap-4">
        <button
          onClick={() => signInWith('google')}
          className="w-full rounded-lg bg-white py-3 font-semibold text-black transition hover:bg-gray-200"
        >
          Continue with Google
        </button>
        <button
          onClick={() => signInWith('apple')}
          className="w-full rounded-lg border border-blade-border bg-blade-surface py-3 font-semibold text-white transition hover:bg-blade-border"
        >
          Continue with Apple
        </button>
      </div>
    </div>
  )
}
