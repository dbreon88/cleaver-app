import { render, screen } from '@testing-library/react'
import { AuthProvider, useAuth } from '@/components/AuthProvider'

function TestConsumer() {
  const { user, loading } = useAuth()
  if (loading) return <div>Loading</div>
  return <div>{user ? user.id : 'No user'}</div>
}

test('renders children and provides auth context', () => {
  render(
    <AuthProvider>
      <TestConsumer />
    </AuthProvider>
  )
  expect(screen.getByText(/loading|no user/i)).toBeInTheDocument()
})
