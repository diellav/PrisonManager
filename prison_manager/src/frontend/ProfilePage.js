import React, { useEffect, useState } from 'react';
import axiosInstance from './axios';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    fetchUser();
    fetchRoles();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axiosInstance.get('/profile');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  };

const fetchRoles = async () => {
  try {
    const response = await axiosInstance.get('/roles/my-role');
    setRoles([response.data]);
  } catch (error) {
    console.error('Failed to fetch role:', error);
  }
};

  const getRoleName = (roleID) => {
    if (!roleID) return 'User';
    const role = roles.find(r => r.roleID === roleID || r.id === roleID);
    return role ? role.name_ || role.name_ : 'User';
  };

  if (!user) return <div>Loading...</div>;

  const roleName = getRoleName(user.roleID);

  return (
    <div className="container">
      <div className="main-body">
        <h3>Welcome to your profile!</h3>
        <p>Here you can find your personal information and role details.</p>
        <br/>
        <div className="row gutters-sm">

          <div className="col-md-4 mb-3">
            <div className="card">
              <div className="card-body">
                <div className="d-flex flex-column align-items-center text-center">
                  <img
                    src={user.photo}
                    alt="Profile"
                    className="rounded-circle"
                    width="100"
                    height="100"
                  />
                  <div className="mt-3">
                    <h4>{user.first_name} {user.last_name}</h4>
                    <p className="text-secondary mb-1">{roleName}</p>
                    <p className="text-muted font-size-sm">{user.address_ || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
            <br></br>
            <p className="text-muted font-size-sm">Employee since ....</p>
            <p>Thank you for being part of our community!</p>
            <br></br>
          </div>

          <div className="col-md-8">
            <div className="card mb-3">
              <div className="card-body">

                <div className="row mb-2">
                  <div className="col-sm-3"><h6 className="mb-0">First Name</h6></div>
                  <div className="col-sm-9 text-secondary"><p>{user.first_name}</p></div>
                </div>
                <hr />

                <div className="row mb-2">
                  <div className="col-sm-3"><h6 className="mb-0">Last Name</h6></div>
                  <div className="col-sm-9 text-secondary"><p>{user.last_name}</p></div>
                </div>
                <hr />

                <div className="row mb-2">
                  <div className="col-sm-3"><h6 className="mb-0">Date of Birth</h6></div>
                  <div className="col-sm-9 text-secondary"><p>{new Date(user.date_of_birth).toLocaleDateString()}</p></div>
                </div>
                <hr />

                <div className="row mb-2">
                  <div className="col-sm-3"><h6 className="mb-0">Gender</h6></div>
                  <div className="col-sm-9 text-secondary"><p>{user.gender}</p></div>
                </div>
                <hr />

                <div className="row mb-2">
                  <div className="col-sm-3"><h6 className="mb-0">Phone</h6></div>
                  <div className="col-sm-9 text-secondary"><p>{user.phone || 'N/A'}</p></div>
                </div>
                <hr />

                <div className="row mb-2">
                  <div className="col-sm-3"><h6 className="mb-0">Address</h6></div>
                  <div className="col-sm-9 text-secondary"><p>{user.address_ || 'N/A'}</p></div>
                </div>
                <hr />

                <div className="row mb-2">
                  <div className="col-sm-3"><h6 className="mb-0">Email</h6></div>
                  <div className="col-sm-9 text-secondary"><p>{user.email}</p></div>
                </div>
                <hr />

                <div className="row mb-2">
                  <div className="col-sm-3"><h6 className="mb-0">Username</h6></div>
                  <div className="col-sm-9 text-secondary"><p>{user.username}</p></div>
                </div>
                <hr />

                <div className="row mb-2">
                  <div className="col-sm-3"><h6 className="mb-0">Role</h6></div>
                  <div className="col-sm-9 text-secondary"><p>{roleName}</p></div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
      <br></br>
          <p> If you notice any incorrect data, please contact support.</p>
            <p>Email: prisonmanager@support.com</p>
            <p>Message at: +1 (123) 6725748</p>
    </div>
  );
};

export default ProfilePage;
