import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import Sidebar from './frontend/sidebar';
import Topbar from './frontend/Topbar';
import RolePage from './frontend/roles/rolePage';
import CellPage from './frontend/cells/cellPage';
import UserPage from './frontend/users/userPage';
import LawyerPage from './frontend/lawyer/LawyerPage';
import EmergencyContactPage from './frontend/emergencyContact/emergencyContactPage';
import BudgetPage from './frontend/budget/budgetPage';
import LoginPage from './frontend/LoginPage';
import ProfilePage from './frontend/ProfilePage';
import BlockPage from './frontend/blocks/BlockPage';
import JudgePage from './frontend/judges/judgePage'; 
import OperationalExpensesPage from './frontend/operational_expenses/OperationalExpensePage';
import SalaryPage from './frontend/staff_salary/StaffSalaryPage';
import AssetPage from './frontend/assets/AssetsPage';
import PrisonersPage from './frontend/prisoners/prisonersPage';
import ParolePage from './frontend/parole/parolePage'; 
import ResetPasswordPage from './frontend/ResetPasswordPage';
import ForgotPasswordPage from './frontend/ForgotPasswordPage';
import StaffSchedulePage from './frontend/schedule/SchedulePage';
import UserScheduleList from './frontend/UserScheduleList';
<<<<<<< HEAD
import TransportStaffPage from './frontend/transport_staff/TransportStaffPage';
=======
import CasesPage from './frontend/cases/casePage'; 

>>>>>>> 27a85e249f757adf6ecf3ae89c6f2653c2529a48
import './Bootstrap/css/sb-admin-2.css';

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('permissions');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login', { replace: true });
  };

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      const publicPaths = ['/login', '/forgot-password'];

      if (token) {
        try {
          const response = await fetch('http://localhost:5000/api/auth/validate', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setIsAuthenticated(true);
            setUser(data.user);
          } else {
            throw new Error('Invalid or expired token');
          }
        } catch (err) {
          localStorage.removeItem('token');
          localStorage.removeItem('permissions');
          setIsAuthenticated(false);
          setUser(null);
          if (!publicPaths.includes(location.pathname) && !location.pathname.startsWith('/reset-password')) {
            navigate('/login', { replace: true });
          }
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
        if (!publicPaths.includes(location.pathname) && !location.pathname.startsWith('/reset-password')) {
          navigate('/login', { replace: true });
        }
      }

      setIsCheckingAuth(false);
    };

    verifyToken();
    const interval = setInterval(verifyToken, 30000);
    return () => clearInterval(interval);
  }, [location.pathname, navigate]);

  if (isCheckingAuth) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  const isLoginPage = location.pathname === '/login';

  return (
    <div id="wrapper" className="d-flex">
      {isAuthenticated && !isLoginPage && <Sidebar onLogout={handleLogout} />}

      <div id="content-wrapper" className="d-flex flex-column w-100">
        {isAuthenticated && !isLoginPage && user && (
          <Topbar
            username={user.username}
            photo={user.photo}
            onLogout={handleLogout}
          />
        )}

        <div id="content" className={isAuthenticated && !isLoginPage ? 'p-4' : ''}>
          <Routes>
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/" replace />
                ) : (
                  <LoginPage
                    onLogin={(decodedUser) => {
                      setIsAuthenticated(true);
                      setUser(decodedUser);
                      navigate('/profile', { replace: true });
                    }}
                  />
                )
              }
            />
            <Route path="/" element={isAuthenticated ? <Navigate to="/profile" replace /> : <Navigate to="/login" replace />} />
            <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" replace />} />
            <Route path="/users" element={isAuthenticated ? <UserPage /> : <Navigate to="/login" replace />} />
            <Route path="/roles" element={isAuthenticated ? <RolePage /> : <Navigate to="/login" replace />} />
            <Route path="/cells" element={isAuthenticated ? <CellPage /> : <Navigate to="/login" replace />} />
            <Route path="/blocks" element={isAuthenticated ? <BlockPage /> : <Navigate to="/login" replace />} />
            <Route path="/lawyer" element={isAuthenticated ? <LawyerPage /> : <Navigate to="/login" replace />} />
            <Route path="/emergencyContact" element={isAuthenticated ? <EmergencyContactPage /> : <Navigate to="/login" replace />} />
            <Route path="/budget" element={isAuthenticated ? <BudgetPage /> : <Navigate to="/login" replace />} />
            <Route path="/judges" element={isAuthenticated ? <JudgePage /> : <Navigate to="/login" replace />} />
            <Route path="/assets" element={isAuthenticated ? <AssetPage /> : <Navigate to="/login" replace />} />
            <Route path="/operational_expenses" element={isAuthenticated ? <OperationalExpensesPage /> : <Navigate to="/login" replace />} />
            <Route path="/staff_salaries" element={isAuthenticated ? <SalaryPage /> : <Navigate to="/login" replace />} />
            <Route path="/prisoners" element={isAuthenticated ? <PrisonersPage /> : <Navigate to="/login" replace />} />
            <Route path="/staff_schedule" element={isAuthenticated ? <StaffSchedulePage /> : <Navigate to="/login" replace />} />
<<<<<<< HEAD
            <Route path="/transport_staff" element={isAuthenticated ? <TransportStaffPage /> : <Navigate to="/login" replace />} />
=======
            <Route path="/paroles" element={isAuthenticated ? <ParolePage /> : <Navigate to="/login" replace />} />
            <Route path="/cases" element={isAuthenticated ? <CasesPage /> : <Navigate to="/login" replace />} />
>>>>>>> 27a85e249f757adf6ecf3ae89c6f2653c2529a48
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/staff_schedule/users/:userID" element={isAuthenticated ? <UserScheduleList /> : <Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to={isAuthenticated ? '/' : '/login'} replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
