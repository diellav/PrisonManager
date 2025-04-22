import React from 'react';
import RolePage from './frontend/rolePage';
import CellPage from './frontend/cellPage';
import './Bootstrap/css/sb-admin-2.css';
import UserPage from './frontend/userPage';
import LawyerPage from './frontend/lawyer/LawyerPage';
function App() {
  return ( 
    <div>
      <RolePage />
      <CellPage />
      <UserPage />
      <LawyerPage />
    </div>
  );
}

export default App;

