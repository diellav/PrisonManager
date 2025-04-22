import React from 'react';
import RolePage from './frontend/roles/rolePage';
import CellPage from './frontend/cells/cellPage';
import './Bootstrap/css/sb-admin-2.css';
import UserPage from './frontend/users/userPage';
import LawyerPage from './frontend/lawyer/LawyerPage';
import EmergencyContactPage from './frontend/emergencyContact/emergencyContactPage';
import BudgetPage from './frontend/budget/budgetPage';

function App() {
  return ( 
    <div>
      <RolePage />
      <CellPage />
      <UserPage />
      <LawyerPage />
      <EmergencyContactPage/>
      <BudgetPage />
    </div>
  );
}

export default App;

