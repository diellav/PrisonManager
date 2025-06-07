import React, { useEffect, useState } from 'react';
import axiosInstance from '../axios';

const hasPermission = (permName) => {
  const perms = JSON.parse(localStorage.getItem("permissions") || "[]");
  return perms.includes(permName.toLowerCase());
};

const VisitRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!hasPermission("manage_visit_requests.read")) {
      setLoading(false);
      setError("You do not have permission to view this page.");
      return;
    }

    const fetchRequests = async () => {
      try {
        const res = await axiosInstance.get('/visit-requests/pending');
        setRequests(res.data);
        setError("");
      } catch (err) {
        console.error('Error fetching visit requests:', err);
        setError("Failed to fetch visit requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const approveRequest = async (requestId) => {
   try {
  const confirm = window.confirm("Are you sure you want to approve this request?");
  if (!confirm) return;

  await axiosInstance.put(`/visit-requests/${requestId}/approve`);
  setRequests(prev => prev.filter(req => req.request_id !== requestId));
  alert("Request approved.");
} catch (err) {
  console.error('Failed to approve request:', err.response || err.message || err);
  alert("Failed to approve request.");
}
  };

  const rejectRequest = async (requestId) => {
    try {
      const confirm = window.confirm("Are you sure you want to reject this request?");
      if (!confirm) return;

      await axiosInstance.put(`/visit-requests/${requestId}/reject`);
      setRequests(prev => prev.filter(req => req.request_id !== requestId));
      alert("Request rejected.");
    } catch (err) {
      console.error('Failed to reject request:', err);
      alert("Failed to reject request.");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  return (
    <div className="container mt-4">
      <h2>Pending Visit Requests</h2>
      {requests.length === 0 ? (
        <p>No pending requests</p>
      ) : (
        <ul className="list-group">
          {requests.map(req => (
            <li key={req.request_id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{req.first_name} {req.last_name}</strong> — Visit Date: {new Date(req.visit_date).toLocaleDateString()}
              </div>
              <div>
                <button
                  className="btn btn-success btn-sm me-2"
                  onClick={() => approveRequest(req.request_id)}
                >
                  Approve
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => rejectRequest(req.request_id)}
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VisitRequestsPage;
