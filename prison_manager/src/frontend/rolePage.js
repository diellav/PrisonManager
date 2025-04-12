import React, { useEffect, useState } from "react";
import axios from "axios";

const RolePage = () => {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    fetchRoles();
  }, []);

const fetchRoles = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/roles");
    setRoles(res.data);
  } catch (err) {
    console.error("Error fetching roles:", err.response ? err.response.data : err.message);
  }
};


  return (
    <div>
      <h2>Roles List</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.roleID}>
              <td>{role.roleID}</td>
              <td>{role.name_}</td>
              <td>{role.description_}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RolePage;
