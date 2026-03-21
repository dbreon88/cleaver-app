import { render, screen, fireEvent } from '@testing-library/react'
import { LikeButton } from '@/components/LikeButton'

test('renders knife emoji and toggles liked state on click', () => {
  const onToggle = jest.fn()
  render(<LikeButton liked={false} count={5} onToggle={onToggle} />)
  const button = screen.getByRole('button', { name: /like/i })
  expect(button).toHaveTextContent('🔪')
  expect(screen.getByText('5')).toBeInTheDocument()
  fireEvent.click(button)
  expect(onToggle).toHaveBeenCalled()
})

test('shows active state when liked', () => {
  render(<LikeButton liked={true} count={10} onToggle={() => {}} />)
  const button = screen.getByRole('button', { name: /unlike/i })
  expect(button).toHaveClass('text-blade-red')
})
