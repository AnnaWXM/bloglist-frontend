import React from 'react';
import Blogs from './Blogs';

const BlogListView = ({ blogPosts, handleLike, deleteBlog }) => {
  return (
    <div>
      <h2>List of Blog Posts</h2>
      <ul>
        {blogPosts.map(blogPost => (
          <Blogs
            key={blogPost.id}
            blog={blogPost}
            handleLike={handleLike}
            deleteBlog={deleteBlog}
          />
        ))}
      </ul>
    </div>
  );
};

export default BlogListView;
