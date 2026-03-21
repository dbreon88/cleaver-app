import { render, screen, fireEvent } from '@testing-library/react'
import { CommentForm } from '@/components/CommentForm'

test('renders input and submit button, calls onSubmit', () => {
  const onSubmit = jest.fn()
  render(<CommentForm onSubmit={onSubmit} />)
  const input = screen.getByPlaceholderText(/comment/i)
  const button = screen.getByRole('button', { name: /post/i })
  fireEvent.change(input, { target: { value: 'Nice knife!' } })
  fireEvent.click(button)
  expect(onSubmit).toHaveBeenCalledWith('Nice knife!')
})
