import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from './axios';


const Sidebar = () => {
  const [permissions, setPermissions] = useState([]);
  const [openSection, setOpenSection] = useState(null);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axiosInstance.get('/auth/sidebar', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPermissions(res.data);
      } catch (err) {
        console.error('Failed to fetch sidebar permissions', err);
      }
    };

    fetchPermissions();
  }, []);

  if (!permissions || permissions.length === 0) {
    return <div>Loading sidebar...</div>;
  }

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
      <Link to="/" className="sidebar-brand d-flex align-items-center justify-content-center">
        <div className="sidebar-brand-text mx-3">Prison Manager</div>
      </Link>

      {permissions.map(({ section, items }, idx) => {
        const isOpen = openSection === section;
        return (
          <li className="nav-item" key={`section-${section}-${idx}`}>
            <div
              className={`nav-link ${isOpen ? '' : 'collapsed'}`}
              onClick={() => toggleSection(section)}
              style={{ cursor: 'pointer' }}
              aria-expanded={isOpen}
            >
              <i className="fas fa-fw fa-folder"></i>
              <span>{section}</span>
            </div>

            <div className={`collapse ${isOpen ? 'show' : ''}`} style={{ paddingLeft: '1rem' }}>
              <div className="bg-white py-2 collapse-inner rounded">
                {items.map(({ label, path }, i) => (
                  <Link
                    key={`perm-${path || i}`}
                    className="collapse-item"
                    to={path || '#'}
                    onClick={() => setOpenSection(null)}
                  >
                    {label || 'No Label'}
                  </Link>
                ))}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default Sidebar;
