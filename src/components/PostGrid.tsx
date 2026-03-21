import Link from 'next/link'
import type { Post } from '@/lib/types'
export function PostGrid({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return <p className="py-10 text-center text-blade-steel">No posts yet</p>
  return (
    <div className="grid grid-cols-3 gap-0.5">
      {posts.map(post => (
        <Link key={post.id} href={`/post/${post.id}`}>
          <img src={post.image_url} alt={post.caption || 'Post'} className="aspect-square w-full object-cover" />
        </Link>
      ))}
    </div>
  )
}
