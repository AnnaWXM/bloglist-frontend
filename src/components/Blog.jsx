import { useState, useEffect } from 'react'

const Blogs = ({ blog, handleLike, deleteBlog }) =>  {
  console.log('Blog ID:', blog.id)

  const [showDetails, setShowDetails] = useState(false)

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  return (
    <li className='blog'>
      <div className="blog-info">
        <div className="blog-details">
          <span className="blog-title">{blog.title}</span>
          <span className="blog-author">{blog.author}</span>
          {showDetails && <span className="blog-url">{blog.url}</span>}
        </div>
        <div className="blog-actions">
          {showDetails &&<button id='likeButton' className="like-button" onClick={() => handleLike(blog._id)}>Like it</button>}
          {showDetails &&<span className="likes-count">Likes: {blog.likes}</span>}
          {showDetails &&<button id='deleteblog' className="delete-button" onClick={() => deleteBlog(blog._id)}>Delete</button>}
          <button id='showDetails' className="toggle-details-button" onClick={toggleDetails}>
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
        </div>
      </div>
    </li>
  )
}

export default Blogs