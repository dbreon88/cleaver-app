import { render, screen, fireEvent } from '@testing-library/react'
import { FollowButton } from '@/components/FollowButton'

test('shows Follow when not following, calls onToggle', () => {
  const onToggle = jest.fn()
  render(<FollowButton following={false} onToggle={onToggle} />)
  const button = screen.getByRole('button', { name: /follow/i })
  expect(button).toHaveTextContent('Follow')
  fireEvent.click(button)
  expect(onToggle).toHaveBeenCalled()
})

test('shows Following when following', () => {
  render(<FollowButton following={true} onToggle={() => {}} />)
  expect(screen.getByRole('button')).toHaveTextContent('Following')
})
