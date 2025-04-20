import React from 'react';
import RolePage from './frontend/rolePage';
import CellPage from './frontend/cellPage';
import './Bootstrap/css/sb-admin-2.css';
import UserPage from './frontend/userPage';
import BudgetPage from './frontend/budget/budgetPage';

function App() {
  return ( 
    <div>
      <RolePage />
      <CellPage />
      <UserPage />
      <BudgetPage />
    </div>
  );
}

export default App;

