'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from './AuthProvider'
import { MessageBadge } from './MessageBadge'

const tabs = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/explore', label: 'Explore', icon: '🔍' },
  { href: '/create', label: 'Create', icon: '➕', adminOnly: true },
  { href: '/messages', label: 'Messages', icon: '✉️' },
]

export function BottomNav() {
  const pathname = usePathname()
  const { user, isAdmin } = useAuth()
  if (!user) return null

  const profileTab = { href: `/profile/${user.username}`, label: 'Profile', icon: '👤' }
  const visibleTabs = [...tabs.filter(t => !t.adminOnly || isAdmin), profileTab]

  return (
    <nav className="fixed bottom-0 left-1/2 z-50 flex w-full max-w-[480px] -translate-x-1/2 border-t border-blade-border bg-blade-bg">
      {visibleTabs.map(tab => {
        const isActive = pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href))
        return (
          <Link key={tab.label} href={tab.href} aria-label={tab.label}
            className={`relative flex flex-1 flex-col items-center py-3 text-xs transition ${isActive ? 'text-white' : 'text-blade-steel'}`}>
            <span className="relative text-xl">
              {tab.icon}
              {tab.label === 'Messages' && <MessageBadge />}
            </span>
            <span className="mt-0.5">{tab.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
