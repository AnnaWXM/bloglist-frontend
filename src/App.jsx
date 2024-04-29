import { useState, useEffect } from 'react'
import Blogs from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import PropTypes from 'prop-types'
import { NotificationProvider, useNotification } from './components/Notification'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { UserProvider, useUser } from './components/User';
import UserView from './components/UserView'
import UserPostsView from './components/UserPostView'
import BlogListView from './components/BlogListView'
import BlogPostView from './components/BlogPostView'
import NavigationMenu from './components/NavigationMenu'
import {
  BrowserRouter as Router,
  Routes, Route, Link, useParams, useNavigate
} from 'react-router-dom'

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
  const [createBlogVisible, setCreateBlogVisible] = useState(false)
  const [message, setMessage] = useState('message recevied.')
  const { state: notificationState, showNotification, hideNotification } = useNotification()
  const queryClient = useQueryClient()
  const { state: { user }, dispatch } = useUser();


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

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      dispatch({ type: 'LOGIN', payload: user });
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
    dispatch({ type: 'LOGOUT' });
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

  const blogsToShow = showAll
    ? blogs
    // eslint-disable-next-line no-undef
    : blogs.filter(blogs => blogs.title.toLowerCase().includes(filter.toLowerCase()))

  const padding = {
    padding: 5
  }

  return (
    <div>
      <h1>Blogs</h1>

      <Router>
      {user === null ? null : <NavigationMenu handleLogout={ handleLogout } />}

      <Routes>
        <Route path="/users" element={<UserView />} />
        <Route path="/users/:userId" element={<UserPostsView />} />
        <Route path="/blogs" element={<BlogListView />} />
        <Route path="/blog/:blogId" element={<BlogPostView />} />
        <Route
            path="/"
            element={
              <>
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
              </>
            }
          />

      </Routes>
    </Router>

    </div>
  )
}

export default App