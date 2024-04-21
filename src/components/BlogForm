import { useState, useEffect } from 'react'

import blogService from '../services/blogs'

const createBlog = blogService.create()

const BlogForm = (createBlog) => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: '' })

  const handleBlogChange = (event) => {
    const { name, value } = event.target
    setNewBlog({ ...newBlog, [name]: value })
  }


  const addBlog = async (event) => {
    event.preventDefault()
    try {
      const createdBlog = await createBlog(newBlog)
      setBlogs([...blogs, createdBlog])
      setNewBlog({
        title: '',
        author: '',
        url: ''
      })
    } catch (error) {
      console.error('Error creating blog:', error.message)
    }
  }
  return(
    <div>
      <form onSubmit={addBlog}>
        <div>
              Title:
          <input
            type="text"
            name="title"
            value={newBlog.title}
            onChange={handleBlogChange}
          />
        </div>
        <div>
              Author:
          <input
            type="text"
            name="author"
            value={newBlog.author}
            onChange={handleBlogChange}
          />
        </div>
        <div>
              URL:
          <input
            type="text"
            name="url"
            value={newBlog.url}
            onChange={handleBlogChange}
          />
        </div>
        <button type="submit">Create Blog</button>
      </form>
    </div>

  )
}

export default BlogForm