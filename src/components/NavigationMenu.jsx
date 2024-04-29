import React from 'react';
import { Link } from 'react-router-dom';

const NavigationMenu = ({ handleLogout }) => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/users">Users</Link>
        </li>
        <li>
          <Link to="/blogs">Blogs</Link>
        </li>
        <li>
          <button onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </nav>
  );
};

export default NavigationMenu;
