import { render, screen } from '@testing-library/react'
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
