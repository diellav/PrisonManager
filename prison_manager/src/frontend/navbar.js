import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/">Prison Manager</Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/roles">Roles</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/users">Users</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/lawyer">Lawyers</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/cells">Cells</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/emergencyContact">Emergency Contact</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/budget">Budget</Link>
          </li>
        </ul>
       
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link" to="/logout">Logout</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
