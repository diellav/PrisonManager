import React, { useEffect, useState } from 'react';
import axiosInstance from './axios';
import UserScheduleList from "./UserScheduleList";
const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await axiosInstance.post('/auth/change-password', {
        userID: user.userID,
        newPassword
      });
      setSuccess('Password changed successfully');
      setError('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setShowModal(false);
        setSuccess('');
      }, 1500);
    } catch (err) {
      setError('Failed to change password');
      setSuccess('');
    }
  };

  if (!user) return <div>Loading...</div>;

  const roleName = getRoleName(user.roleID);
  const userID = user.userID; 

  return (
    <div className="container">
      <div className="main-body">
        <h3>Welcome to your profile!</h3>
        <p>Here you can find your personal information and role details.</p>
        <br />
        <div className="row gutters-sm">
          <div className="col-md-4 mb-3">
            <div className="card">
              <div className="card-body">
                <div className="d-flex flex-column align-items-center text-center">
                <img
                    src={user.photo ? `http://localhost:5000/uploads/${user.photo}` : "/default-avatar.png"}
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
            <br />
          {roleName!=='SuperAdmin'&&( <p className="text-muted font-size-sm">Employee since {user.employment_date?.split('T')[0]}</p>)}
            <p>Thank you for being part of our community!</p>
            <br />
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
              <button className="btn btn-link" onClick={() => setShowModal(true)}>Change your password</button>
            </div>
          </div>
        </div>
      </div>
      <br /><br/>
    {roleName!=='SuperAdmin'&&( <UserScheduleList userID={userID} /> )}

    <br/><br/>
      <p>If you notice any incorrect data, please contact support.</p>
      <p>Email: prisonmanager@support.com</p>
      <p>Message at: +1 (123) 6725748</p>

      {showModal && (
        <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Change Password</h5>
                <button type="button" className="close" onClick={() => setShowModal(false)}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}
                <div className="form-group">
                  <label>New Password</label>
                  <input type="password" className="form-control" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input type="password" className="form-control" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleChangePassword}>Change</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
