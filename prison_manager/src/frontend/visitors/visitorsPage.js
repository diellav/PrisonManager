import React, { useState, useEffect } from "react";
import axiosInstance from "../axios";
import VisitorsList from "./VisitorsList";

const VisitorsPage = () => {
  const [visitors, setVisitors] = useState([]);

  const fetchVisitors = async () => {
    try {
      const response = await axiosInstance.get("/visitors");
      setVisitors(response.data);
    } catch (error) {
      console.error("Error fetching visitors:", error);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  const handleDelete = async (visitorId) => {
    if (window.confirm("Are you sure you want to delete this visitor?")) {
      try {
        await axiosInstance.delete(`/visitors/${visitorId}`);
        fetchVisitors();
      } catch (error) {
        console.error("Error deleting visitor:", error);
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Visitors Management</h2>
      <div className="card shadow rounded-4">
        <div className="card-body p-0">

          <VisitorsList visitors={visitors} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  );
};

export default VisitorsPage;
