import React, { useState, useEffect } from "react";
import axiosInstance from "../axios";
import VisitsList from "./visitsList";

const VisitsPage = () => {
  const [visits, setVisits] = useState([]);

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const response = await axiosInstance.get("/visits/approved");
        setVisits(response.data);
      } catch (error) {
        console.error("Error fetching visits:", error);
      }
    };

    fetchVisits();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Approved Visits</h2>
      <VisitsList visits={visits} />
    </div>
  );
};

export default VisitsPage;
