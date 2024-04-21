import { useState, useEffect } from 'react'
import Blogs from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import PropTypes from 'prop-types'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: '' })
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [createBlogVisible, setCreateBlogVisible] = useState(false)
  const [message, setMessage] = useState('message recevied.')


  useEffect(() => {
    blogService
      .getAll().then(initialBlogs => {
        const sortedBlogs = initialBlogs.sort((a, b) => b.likes - a.likes)
        setBlogs(sortedBlogs)
      })
  }, [])

  const addBlog = async (event) => {
    event.preventDefault()
    try {
      const createdBlog = await blogService.create(newBlog)
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

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    } else {
      setUser(null) // No token found, user is not authenticated
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setErrorMessage(null)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const handleBlogChange = (event) => {
    const { name, value } = event.target
    setNewBlog({ ...newBlog, [name]: value })
  }

  const handleLike = async (blogID) => {

    try {
      const updatedBlog = await blogService.like(blogID)

      setBlogs(prevBlogs =>
        prevBlogs.map(blog =>
          blog._id === blogID ? { ...blog, likes: updatedBlog.likes } : blog
        )
      )
    } catch (error) {
      console.error('Error updating like:', error.message)
    }
  }

  const deleteBlog = (id) => {
    const confirmation = window.confirm('Delete this blog?')
    if (confirmation) {
      blogService
        .remove(id)
        .then(() => {
          setBlogs(blogs.filter(blog => blog.id !== id))
        })
      setMessage('the blog information deleted')
    }
  }

  deleteBlog.propTypes = {
    id:PropTypes.string.isRequired
  }


  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )



  const blogForm = () => {
    const hideWhenVisible = { display: createBlogVisible ? 'none' : '' }
    const showWhenVisible = { display: createBlogVisible ? '' : 'none' }
    return(
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setCreateBlogVisible(true)}>create blog</button>
        </div>
        <div style={showWhenVisible}>
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
          <button onClick={() => setCreateBlogVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  const Notification = ({ message, type }) => {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
      if (message) {
        setIsVisible(true)
        const timer = setTimeout(() => {
          setIsVisible(false)
        }, 3000)
        return () => clearTimeout(timer)
      }
    }, [message])

    if (!isVisible) {
      return null
    }

    const className = type === 'error' ? 'error' : 'notification'

    return (
      <div className={className}>
        {message}
      </div>
    )
  }


  const blogsToShow = showAll
    ? blogs
    // eslint-disable-next-line no-undef
    : blogs.filter(blogs => blogs.title.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h1>Blogs</h1>
      <Notification message={errorMessage} type="error" />
      {user === null ?
        loginForm() :
        <div>
          <p>{user.name} logged-in</p>
          <button onClick={handleLogout}>Logout</button>
          {blogForm()}
          <ul>
            {blogsToShow.map(blog =>
              <Blogs
                key={blog.id}
                blog={blog}
                handleLike={() => handleLike(blog.id)}
                deleteBlog={() => deleteBlog(blog.id)}
              />
            )}
          </ul>
        </div>
      }



    </div>
  )
}

export default App