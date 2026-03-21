import { render, screen, fireEvent } from '@testing-library/react'
import { SaveButton } from '@/components/SaveButton'

test('renders unsaved state by default', () => {
  const onToggle = jest.fn()
  render(<SaveButton saved={false} onToggle={onToggle} />)
  const button = screen.getByRole('button', { name: /save/i })
  expect(button).toBeInTheDocument()
  fireEvent.click(button)
  expect(onToggle).toHaveBeenCalled()
})

test('renders saved state when saved is true', () => {
  render(<SaveButton saved={true} onToggle={() => {}} />)
  const button = screen.getByRole('button', { name: /unsave/i })
  expect(button).toBeInTheDocument()
})
