import { render, screen } from '@testing-library/react'
import { BottomNav } from '@/components/BottomNav'

jest.mock('@/components/AuthProvider', () => ({
  useAuth: () => ({ user: { username: 'testuser', role: 'user' }, isAdmin: false }),
}))
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}))
jest.mock('@/components/MessageBadge', () => ({
  MessageBadge: () => null,
}))

test('renders 4 tabs for non-admin users', () => {
  render(<BottomNav />)
  expect(screen.getByLabelText('Home')).toBeInTheDocument()
  expect(screen.getByLabelText('Explore')).toBeInTheDocument()
  expect(screen.getByLabelText('Messages')).toBeInTheDocument()
  expect(screen.getByLabelText('Profile')).toBeInTheDocument()
  expect(screen.queryByLabelText('Create')).not.toBeInTheDocument()
})
