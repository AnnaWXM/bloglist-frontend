import { useState, useEffect } from 'react'
import Blogs from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import PropTypes from 'prop-types'
import { NotificationProvider, useNotification } from './components/Notification'
import { useQuery, useMutation, useQueryClient } from 'react-query'

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
  const { state: notificationState, showNotification, hideNotification } = useNotification()
  const queryClient = useQueryClient()


  useQuery(blogs, async () => {
    const response = await blogService.getAll();
    return response;
  });

  const createBlogMutation = useMutation(newBlog => blogService.create(newBlog), {
    onSuccess: () => {
      queryClient.invalidateQueries('blogs');
      setMessage('Blog created successfully.');
    },
    onError: error => {
      setMessage(`Error creating blog: ${error.message}`);
    },
  });

  const addBlog = async event => {
    event.preventDefault();
    try {
      await createBlogMutation.mutateAsync(newBlog);
      setCreateBlogVisible(false);
    } catch (error) {
      console.error('Error creating blog:', error.message);
    }
  };
/*
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
*/
  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      setUser(user)
      setErrorMessage(null)
      setMessage('Logged in successfully.')
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong username or password')
    }
  }

  const handleLogout = () => {
    setMessage('Logged out successfully.')
    setUser(null)
  }

  const handleBlogChange = (event) => {
    const { name, value } = event.target
    setNewBlog({ ...newBlog, [name]: value })
  }

  // Like blog mutation
  const likeBlogMutation = useMutation(blogID => blogService.like(blogID), {
    onSuccess: () => {
      queryClient.invalidateQueries('blogs');
      setMessage('Blog liked successfully.');
    },
    onError: error => {
      setMessage(`Error liking blog: ${error.message}`);
    },
  });

  const handleLike = async (blogID) => {
    try {
      await likeBlogMutation.mutateAsync(blogID);
    } catch (error) {
      console.error('Error updating like:', error.message);
    }
  };

  // Delete blog mutation
  const deleteBlogMutation = useMutation(blogID => blogService.remove(blogID), {
    onSuccess: () => {
      queryClient.invalidateQueries('blogs');
      setMessage('Blog deleted successfully.');
    },
    onError: error => {
      setMessage(`Error deleting blog: ${error.message}`);
    },
  });

  const deleteBlog = async (id) => {
    try {
      await deleteBlogMutation.mutateAsync(id);
    } catch (error) {
      console.error('Error deleting blog:', error.message);
    }
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          id='username'
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          id='password'
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button id='login-button' type="submit">login</button>
    </form>
  )



  const blogForm = () => {
    const hideWhenVisible = { display: createBlogVisible ? 'none' : '' }
    const showWhenVisible = { display: createBlogVisible ? '' : 'none' }
    return(
      <div>
        <div style={hideWhenVisible}>
          <button id='showBlogForm' onClick={() => setCreateBlogVisible(true)}>create blog</button>
        </div>
        <div style={showWhenVisible}>
          <form onSubmit={addBlog}>
            <div>
              Title:
              <input
                id='title'
                type="text"
                name="title"
                value={newBlog.title}
                onChange={handleBlogChange}
              />
            </div>
            <div>
              Author:
              <input
                id='author'
                type="text"
                name="author"
                value={newBlog.author}
                onChange={handleBlogChange}
              />
            </div>
            <div>
              URL:
              <input
                id='URL'
                type="text"
                name="url"
                value={newBlog.url}
                onChange={handleBlogChange}
              />
            </div>
            <button id='createBlog' type="submit">Create Blog</button>
          </form>
          <button onClick={() => setCreateBlogVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }
/*
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
*/

  const blogsToShow = showAll
    ? blogs
    // eslint-disable-next-line no-undef
    : blogs.filter(blogs => blogs.title.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h1>Blogs</h1>
      {message && <div>{message}</div>}
      {notificationState.message && (
        <div className={notificationState.type === 'error' ? 'error' : 'notification'}>
          {notificationState.message}
        </div>
      )}
      {user === null ?
        loginForm() :
        <div>
          <p>{user.name} logged-in</p>
          <button id='logout' onClick={handleLogout}>Logout</button>
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