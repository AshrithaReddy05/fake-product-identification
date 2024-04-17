import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    fetch('http://localhost:5000/api/logout', {
      method: 'GET',
      credentials: 'include', // Include cookies
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Logout failed');
    })
    .then(data => {
      console.log(data.message); // Message from the server
      // You can redirect to the login page or do other actions here
      navigate('/');
    })
    .catch(error => console.error('Logout error:', error));
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <a className="navbar-brand" href="/">Home</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
