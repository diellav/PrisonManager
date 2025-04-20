import React from 'react';
import RolePage from './frontend/roles/rolePage';
import CellPage from './frontend/cells/cellPage';
import './Bootstrap/css/sb-admin-2.css';
import UserPage from './frontend/users/userPage';
import EmergencyContactPage from './frontend/emergencyContact/emergencyContactPage';
import BudgetPage from './frontend/budget/budgetPage';

function App() {
  return ( 
    <div>
      <RolePage />
      <CellPage />
      <UserPage />
      <EmergencyContactPage/>
      <BudgetPage />
    </div>
  );
}

export default App;

