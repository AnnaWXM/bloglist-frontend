import { useState, useEffect } from 'react';
import userService from '../services/users';

const UserView = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userData = await userService.getAll();
        setUsers(userData);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Display loading indicator
  }

  if (error) {
    return <div>Error: {error}</div>; // Display error message
  }

  return (
    <div>
      <h2>User Information</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <div>Name: {user.name}</div>
            <div>Email: {user.email}</div>
            {/* Add more user information fields here */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserView;
