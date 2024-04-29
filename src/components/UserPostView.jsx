import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import blogService from '../services/blogs';

const UserPostsView = () => {
  const { userId } = useParams();
  const [userPosts, setUserPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const posts = await blogService.getPostsByUser(userId);
        setUserPosts(posts);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchUserPosts();
  }, [userId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>User Posts</h2>
      <ul>
        {userPosts.map(post => (
          <li key={post.id}>
            <div>Title: {post.title}</div>
            <div>Content: {post.content}</div>
            {/* Display other post details */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserPostsView;
