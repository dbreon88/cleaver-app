import Link from 'next/link'
import { UserAvatar } from './UserAvatar'
import type { Comment } from '@/lib/types'

export function CommentList({ comments }: { comments: Comment[] }) {
  if (comments.length === 0) {
    return <p className="px-4 py-6 text-center text-blade-steel text-sm">No comments yet</p>
  }
  return (
    <div className="flex flex-col gap-3 px-4 py-3">
      {comments.map(comment => (
        <div key={comment.id} className="flex gap-3">
          <Link href={`/profile/${comment.user?.username}`}>
            <UserAvatar src={comment.user?.avatar_url ?? null} username={comment.user?.username ?? ''} size={28} />
          </Link>
          <div>
            <Link href={`/profile/${comment.user?.username}`} className="font-semibold text-white text-sm">
              {comment.user?.username}
            </Link>
            <p className="text-sm text-blade-silver">{comment.body}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
