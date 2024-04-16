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

  const addBlog = (event) => {
    event.preventDefault();
    const existBlog = blogs.find((blog) => blog.url === newUrl)
    if (existBlog) {
      const confirmation = window.confirm('This blog already exists, replace the old information with a new one?');
      if (confirmation) {
        const updateBlog = { ...existBlog, author: newAuthor, title: newTitle }
        blogService
          .update(existBlog._id, updateBlog)
          .then(returnedBlog => {
            const updateBlogs = blogs.map(blog => (blog._id === returnedBlog._id ? returnedBlog : blog))
            setBlogs(updateBlogs)
            setNewAuthor('')
            setNewTitle('')
            setLikes(0)
          })
          .catch(error => {
            setMessage(`Information of ${newUrl} has been removed from server`)
            setIsError(true)
          })
        setMessage(`${existBlog.url} information changed`)
      }
    }
    else {
      let idint;
      if (blogs.length == 0) {
        idint = 1
      }
      else {
        idint = blogs.length + 1
      }
      let existId = blogs.find((blog) => blog._id == idint)
      while (existId) {
        idint = idint + 1
        existId = blogs.find((blog) => blog._id == idint)
      }
      const newBlog = { title: newTitle, author: newAuthor, _id: idint.toString(), url: newUrl };
      blogService
        .create(newBlog)
        .then(returnedBlog => {
          setPlogs(blogs.concat(returnedBlog))
          setNewTitle('')
          setNewAuthor('')
          setNewUrl('')
          setLikes(0)
        })
      setMessage(`${newTitle} blog added`)
    }
  }

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
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
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleBlogChange = (event) => {
    setNewBlog(event.target.value);
  };

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

  const Blogs = ({ blogs, handleLike, deletePlog }) => {
    return (
      <ul>
        {blogs.map(plog => (
          <li className='plog' key={plog._id}>
          <div className="plog-info">
            <div className="plog-details">
              <span className="plog-title">{plog.title}</span>
              <span className="plog-author">{plog.author}</span>
              <span className="plog-url">{plog.url}</span>
            </div>
            <div className="plog-actions">
              <button className="like-button" onClick={() => handleLike(plog._id)}>Like it</button>
              <span className="likes-count">Likes: {plog.likes}</span>
              <button className="delete-button" onClick={() => deletePlog(plog._id)}>Delete</button>
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
    }



    </div>
  )
}

export default App