import { render, screen } from '@testing-library/react'
import { ShareButton } from '@/components/ShareButton'

test('renders share button with correct aria-label', () => {
  render(<ShareButton postId="test-post-123" />)
  const button = screen.getByRole('button', { name: /share/i })
  expect(button).toBeInTheDocument()
})
