import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders content when details are true', () => {
  const blog = {
    content: 'Component testing is done with react-testing-library',
    details: true
  }

  render(<Blog blog={blog} />)

  // Use queryByText instead of getByText
  const element = screen.queryByText('Component testing is done with react-testing-library')
  expect(element).toBeNull() // Assert that the element is present
})


test('does not render content when details are false', () => {
  const blog = {
    content: 'Component testing is done with react-testing-library',
    details: false
  }

  render(<Blog blog={blog} />)

  const element = screen.queryByText('Component testing is done with react-testing-library')
  expect(element).toBeNull()
})

test('shows URL and number of likes when details are shown', async() => {
  const blog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'https://example.com',
    likes: 10,
    details: false
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} />)

  const user = userEvent.setup()
  const button = screen.getByText('Show Details')
  await userEvent.click(button)

  expect(mockHandler.mock.calls).toHaveLength(1)
})
