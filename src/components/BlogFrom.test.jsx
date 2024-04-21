import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import BlogForm from './BlogForm'


test('calls event handler with correct details when a new blog is created', async () => {
  const mockCreateBlog = vi.fn()
  render(<BlogForm addBLog={mockCreateBlog} />) // Pass mockCreateBlog as a prop

  const titleInput = screen.getByLabelText('Title:')
  const authorInput = screen.getByLabelText('Author:')
  const urlInput = screen.getByLabelText('URL:')

  userEvent.type(titleInput, 'Test Blog Title')
  userEvent.type(authorInput, 'Test Author')
  userEvent.type(urlInput, 'https://example.com')

  const submitButton = screen.getByText('Create Blog')
  await userEvent.click(submitButton)

  expect(mockCreateBlog).toHaveBeenCalledTimes(1)
  expect(mockCreateBlog).toHaveBeenCalledWith({
    title: 'Test Blog Title',
    author: 'Test Author',
    url: 'https://example.com'
  })
})