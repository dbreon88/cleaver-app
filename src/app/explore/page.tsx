import { createClient } from '@/lib/supabase-server'
import { PostGrid } from '@/components/PostGrid'
import { ExploreSearch } from './ExploreSearch'

export default async function ExplorePage() {
  const supabase = await createClient()
  const { data: posts } = await supabase.from('posts').select('*').order('created_at', { ascending: false })
  return (
    <main>
      <header className="sticky top-0 z-40 border-b border-blade-border bg-blade-bg px-4 py-3">
        <h1 className="text-lg font-bold text-white">Explore</h1>
      </header>
      <ExploreSearch />
      <PostGrid posts={posts || []} />
    </main>
  )
}
