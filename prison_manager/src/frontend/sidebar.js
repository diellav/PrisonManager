import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ onLogout }) => {
  return (
    <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
      <Link className="sidebar-brand d-flex align-items-center justify-content-center" to="/">
        <div className="sidebar-brand-text mx-3">Prison Manager</div>
      </Link>

      <hr className="sidebar-divider my-0" />

      <li className="nav-item">
        <Link className="nav-link" to="/roles">
          <i className="fas fa-user-tag"></i>
          <span>Roles</span>
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/">
          <i className="fas fa-users"></i>
          <span>Users</span>
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/lawyer">
          <i className="fas fa-gavel"></i>
          <span>Lawyers</span>
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/cells">
          <i className="fas fa-door-open"></i>
          <span>Cells</span>
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/emergencyContact">
          <i className="fas fa-phone-alt"></i>
          <span>Emergency Contact</span>
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/budget">
          <i className="fas fa-wallet"></i>
          <span>Budget</span>
        </Link>
      </li>

      <hr className="sidebar-divider d-none d-md-block" />
    </ul>
  );
};

export default Sidebar;
