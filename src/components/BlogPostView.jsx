
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import blogService from '../services/blogService';

const BlogPostView = () => {
  const { blogId } = useParams();
  const [blogPost, setBlogPost] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const post = await blogService.getBlogPostById(blogId); // Fetch specific blog post data
        setBlogPost(post);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchBlogPost();
  }, [blogId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Blog Post Details</h2>
      <div>
        <h3>Title: {blogPost.title}</h3>
        <p>Author: {blogPost.author}</p>
        <p>Content: {blogPost.content}</p>
      </div>
    </div>
  );
};

export default BlogPostView;
