import React from 'react';
import RolePage from './frontend/rolePage';
import CellPage from './frontend/cells/cellPage';
import './Bootstrap/css/sb-admin-2.css';
import UserPage from './frontend/users/userPage';
import EmergencyContactPage from './frontend/emergencyContact/emergencyContactPage';

function App() {
  return ( 
    <div>
      <RolePage />
      <CellPage />
      <UserPage />
      <EmergencyContactPage/>
    </div>
  );
}

export default App;

