import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Topbar = ({ username, photo, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();

  const toggleDropdown = () => setIsOpen(prev => !prev);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
      <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
        <i className="fa fa-bars"></i>
      </button>

      <ul className="navbar-nav ml-auto">
        <div className="topbar-divider d-none d-sm-block"></div>

        <li className="nav-item dropdown no-arrow" ref={dropdownRef}>
          <div
            className="nav-link dropdown-toggle"
            role="button"
            onClick={toggleDropdown}
            style={{ cursor: 'pointer' }}
          >
            <span className="mr-2 d-none d-lg-inline text-gray-600 small">{username}</span>
            <img
                className="img-profile rounded-circle"
                src={photo ? `http://localhost:5000/uploads/${photo}` : "/default-avatar.png"}
                alt="profile"
                style={{ width: '32px', height: '32px' }}
              />

          </div>

          {isOpen && (
            <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in show">
              <Link to="/profile" className="dropdown-item" onClick={() => setIsOpen(false)}>
                <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                View Profile
              </Link>

              <div className="dropdown-divider"></div>

              <button className="dropdown-item" onClick={onLogout}>
                <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                Logout
              </button>
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Topbar;
