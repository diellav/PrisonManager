import React, { useEffect, useState } from 'react';
import axiosInstance from './axios';

const VisitorDashboard = () => {
  const [visitor, setVisitor] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({ prisonerID: '' ,relationship:'', visit_date: ''});

  useEffect(() => {
    fetchVisitorProfile();
  }, []);

  const fetchVisitorProfile = async () => {
    try {
      const response = await axiosInstance.get('/visitors/profile');
      setVisitor(response.data);
    } catch (err) {
      console.error('Failed to fetch visitor profile:', err);
      setError('Could not load visitor data.');
    }
  };

  const handleVisitRequest = async () => {
  try {
    if (!form.prisonerID || !form.relationship || !form.visit_date) {
      setError("Please fill in all the fields.");
      return;
    }




      await axiosInstance.post('/visit-requests', {
        visitor_ID: visitor.visitor_ID,
        prisonerID: parseInt(form.prisonerID),
       relationship: form.relationship,
       visit_date: form.visit_date
});

      setSuccessMessage("Your visit request has been sent. Please wait for approval.");
    setForm({ prisonerID: '', relationship: '', visit_date: '' });
  } catch (err) {
    console.error('Failed to send visit request:', err);
    if (err.response?.status === 404) {
      setError("The prisoner ID you entered does not exist.");
    } else {
      setError('Could not send visit request.');
    }
  }
};

  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error]);

  if (!visitor) return <div className="text-center mt-5">Loading visitor dashboard...</div>;

  return (
    <div className="container mt-5">
      <div className="mb-4 p-4 bg-light border rounded">
        <h2 className="mb-3 text-primary">📍 Welcome to Greenfield Correctional Facility</h2>
        <p>
          This is the official visitor portal of Greenfield Correctional Facility. Here, you can view your profile,
          request visits, and track their status. Please make sure to follow the rules and provide accurate details.
        </p>
        <ul>
          <li>Visit requests must be submitted at least 3 days in advance.</li>
          <li>A valid ID is required upon arrival.</li>
          <li>Only approved visitors are allowed to enter the premises.</li>
        </ul>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h4 className="mb-3 text-success">👤 Visitor Profile</h4>
          <div className="row mb-2">
            <div className="col-sm-3"><strong>First Name:</strong></div>
            <div className="col-sm-9">{visitor.first_name}</div>
          </div>
          <div className="row mb-2">
            <div className="col-sm-3"><strong>Last Name:</strong></div>
            <div className="col-sm-9">{visitor.last_name}</div>
          </div>
          <div className="row mb-2">
            <div className="col-sm-3"><strong>Email:</strong></div>
            <div className="col-sm-9">{visitor.email}</div>
          </div>
          <div className="row mb-2">
            <div className="col-sm-3"><strong>Username:</strong></div>
            <div className="col-sm-9">{visitor.username}</div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
            <>
              <div className="mb-3">
                <label className="form-label">Prisoner ID</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.prisonerID}
                  onChange={(e) => setForm({ ...form, prisonerID: e.target.value })}
                />
              </div>
               <div className="mb-3">
                <label className="form-label">Relationship</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.relationship}
                  onChange={(e) => setForm({ ...form, relationship: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Visit Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={form.visit_date}
                  onChange={(e) => setForm({ ...form, visit_date: e.target.value })}
                />
              </div>
              <button className="btn btn-primary" onClick={handleVisitRequest}>
                Request a Visit
              </button>
            </>
          

          {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
          {error && <div className="alert alert-danger mt-3">{error}</div>}
        </div>
      </div>

      <footer className="text-center mt-5 text-muted">
        <hr />
        <p>📧 For support or questions, contact: prisonmanager@support.com</p>
        <p>📞 Phone: +1 (123) 672-5748</p>
      </footer>
    </div>
  );
};

export default VisitorDashboard;
