import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)


  useEffect(() => {
    blogService
      .getAll().then(initialBlogs => {
        setBlogs(initialBlogs)
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
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

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <input
        value={newBlog}
        onChange={handleBlogChange}
      />
      <button type="submit">save</button>
    </form>
  )

  const Notification = ({ message, type }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      if (message) {
        setIsVisible(true);
        const timer = setTimeout(() => {
          setIsVisible(false);
        }, 3000);
        return () => clearTimeout(timer);
      }
    }, [message]);

    if (!isVisible) {
      return null;
    }

    let className = 'notification'
    if (type === 'error') {
      className = 'error'
    }

    return (
      <div className={className}>
        {message}
      </div>
    );
  }

  const Blogs = ({ blogs, handleLike, deletePerson }) => {
    return (
      <ul>
        {blogs.map(person => (
          <li className='person' key={person._id}>
          <div className="person-info">
            <div className="person-details">
              <span className="person-title">{person.title}</span>
              <span className="person-author">{person.author}</span>
              <span className="person-url">{person.url}</span>
            </div>
            <div className="person-actions">
              <button className="like-button" onClick={() => handleLike(person._id)}>Like it</button>
              <span className="likes-count">Likes: {person.likes}</span>
              <button className="delete-button" onClick={() => deletePerson(person._id)}>Delete</button>
            </div>
          </div>
        </li>

        ))}
      </ul>
    );
  };
  const blogsToShow = showAll
    ? blogs
    : blogs.filter(blogs => blogs.title.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h1>Blogs</h1>

      <Notification message={errorMessage} />

      {user === null ?
      loginForm() :
      <div>
        <p>{user.name} logged-in</p>
        {blogForm()}
      </div>
    }

      <ul>
        {blogsToShow.map((blog, i) =>
          <Blog
            key={i}
            blog={blog}
            toggleImportance={() => toggleImportanceOf(blog.id)}
          />
        )}
      </ul>

    </div>
  )
}

export default App