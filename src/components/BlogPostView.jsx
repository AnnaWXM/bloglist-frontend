import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Button, Form, ListGroup } from 'react-bootstrap'; // Import React Bootstrap components
import blogService from '../services/blogs'

const BlogPostView = () => {
  const { blogId } = useParams();
  const [blogPost, setBlogPost] = useState({});
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const post = await blogService.getBlogPostById(blogId);
        setBlogPost(post);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchBlogPost();
  }, [blogId]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const fetchedComments = await blogService.getCommentsForBlog(blogId);
        setComments(fetchedComments);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [blogId]);

  const handleCommentSubmit = async (comment) => {
    try {
      await blogService.addCommentToBlog(blogId, comment);
      // Refresh comments after adding a new comment
      const fetchedComments = await blogService.getCommentsForBlog(blogId);
      setComments(fetchedComments);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Blog Post Details</h2>
      <Card>
        <Card.Body>
          <Card.Title>{blogPost.title}</Card.Title>
          <Card.Text>{blogPost.content}</Card.Text>
        </Card.Body>
      </Card>
      <h3>Comments</h3>
      <CommentForm onSubmit={handleCommentSubmit} />
      <CommentList comments={comments} />
    </div>
  );
};

const CommentForm = ({ onSubmit }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(comment);
    setComment('');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="commentForm">
        <Form.Control
          as="textarea"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add your comment..."
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
};

const CommentList = ({ comments }) => {
  return (
    <ListGroup>
      {comments.map((comment, index) => (
        <ListGroup.Item key={index}>{comment}</ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default BlogPostView;
