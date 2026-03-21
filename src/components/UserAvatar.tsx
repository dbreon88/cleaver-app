import Image from 'next/image'
interface UserAvatarProps { src: string | null; username: string; size?: number }
export function UserAvatar({ src, username, size = 32 }: UserAvatarProps) {
  if (!src) {
    return (
      <div className="flex items-center justify-center rounded-full bg-blade-border text-blade-steel font-bold"
        style={{ width: size, height: size, fontSize: size * 0.4 }}>
        {username[0]?.toUpperCase()}
      </div>
    )
  }
  return <Image src={src} alt={username} width={size} height={size} className="rounded-full object-cover" />
}
