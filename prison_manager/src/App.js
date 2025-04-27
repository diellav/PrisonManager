import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './frontend/sidebar'; 
import RolePage from './frontend/roles/rolePage';
import CellPage from './frontend/cells/cellPage';
import UserPage from './frontend/users/userPage';
import LawyerPage from './frontend/lawyer/LawyerPage';
import EmergencyContactPage from './frontend/emergencyContact/emergencyContactPage';
import BudgetPage from './frontend/budget/budgetPage';

import './Bootstrap/css/sb-admin-2.css';

function App() {
  return (
    <Router>
      <div id="wrapper" className="d-flex">
        <Sidebar />


        <div id="content-wrapper" className="d-flex flex-column w-100">
          <div id="content" className="p-4">
            <Routes>
              <Route path="/" element={<UserPage />} />
              <Route path="/roles" element={<RolePage />} />
              <Route path="/cells" element={<CellPage />} />
              <Route path="/lawyer" element={<LawyerPage />} />
              <Route path="/emergencyContact" element={<EmergencyContactPage />} />
              <Route path="/budget" element={<BudgetPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
