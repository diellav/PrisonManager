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
import JudgePage from './frontend/judges/judgePage';
import OperationalExpensesPage from './frontend/operational_expenses/OperationalExpensePage';
import SalaryPage from './frontend/staff_salary/StaffSalaryPage';
import AssetPage from './frontend/assets/AssetsPage';
import PrisonersPage from './frontend/prisoners/prisonersPage';
import ParolePage from './frontend/parole/parolePage';
import ParolePage from './frontend/parole/parolePage';
import ResetPasswordPage from './frontend/ResetPasswordPage';
import ForgotPasswordPage from './frontend/ForgotPasswordPage';
import StaffSchedulePage from './frontend/schedule/SchedulePage';
import UserScheduleList from './frontend/UserScheduleList';
import CasesPage from './frontend/cases/casePage';
import CasesPage from './frontend/cases/casePage';
import TransportStaffPage from './frontend/transport_staff/TransportStaffPage';
import CourtHearingPage from './frontend/court_hearings/court_hearingPage';
import PrisonerCallPage from './frontend/prisoner_calls/prisoner_callPage';
import PrisonerMovementsPage from './frontend/prisonerMovements/prisonerMovementsPage';
import PrisonerWorkPage from './frontend/prisoner_work/PrisonerWorkPage';
import KitchenStaffPage from './frontend/kitchen_staff/KitchenStaffPage';
import MaintenanceStaffPage from './frontend/maintenance_staff/maintenance_staffPage';
import IncidentsPage from './frontend/incidents/IncidentsPage';
import MedicalStaffPage from './frontend/medicalStaff/medicalStaffPage';
import VisitorSignUpPage from './frontend/visitors/VisitorSignUpPage';
import VisitorsPage from './frontend/visitors/visitorsPage';
import VisitorDashboard from './frontend/VisitorDashboard';
import GuardStaffPage from './frontend/guard_staff/GuardStaffPage';
import SecurityLogsPage from './frontend/securityLogs/SecurityLogsPage';
import AppointmentsPage from './frontend/appointments/appointmentsPage';
import MedicalRecordsPage from './frontend/medicalRecords/medicalRecordsPage';
import VisitRequestsPage from './frontend/visitors/VisitRequestPage';
import VisitsPage from "./frontend/visits/visitsPage"; 
import './Bootstrap/css/sb-admin-2.css';
import TransactionsPage from './frontend/transactions/transactionsPage';
import PrisonPurchasesPage from './frontend/prison_purchases/prisonPurchasesPage';
import StoreItemsPage from './frontend/store_items/StoreItemsPage';
import VehiclesPage from './frontend/vehicles/VehiclesPage';
import TransportPage from './frontend/transport/TransportPage';


import './Bootstrap/css/sb-admin-2.css';

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('permissions');
    setIsAuthenticated(false);
    setUser(null);
    setUserType(null);
    navigate('/login', { replace: true });
    localStorage.removeItem('userType');
  };

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      const publicPaths = ['/login', '/forgot-password', '/visitor-signup'];

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
            setUserType(data.user.type);

            if (data.user.type === 'visitor' && location.pathname !== '/visitor-dashboard') {
              navigate('/visitor-dashboard', { replace: true });
            }

          } else {
            throw new Error('Invalid token');
          }
        } catch {
          localStorage.removeItem('token');
          localStorage.removeItem('permissions');
          setIsAuthenticated(false);
          setUser(null);
          setUserType(null);
          if (!publicPaths.includes(location.pathname)) {
            navigate('/login', { replace: true });
          }
        }
      } else {
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
      {isAuthenticated && !isLoginPage && userType !== 'visitor' && <Sidebar onLogout={handleLogout} />}
      <div id="content-wrapper" className="d-flex flex-column w-100">
        {isAuthenticated && !isLoginPage && user && (
          <Topbar username={user.username} photo={user.photo} onLogout={handleLogout} />
        )}
        <div id="content" className={isAuthenticated && !isLoginPage ? 'p-4' : ''}>
          <Routes>
      <Route path="/login" element={ isAuthenticated ? ( userType === 'visitor' ?
       ( <Navigate to="/visitor-dashboard" replace /> ) : ( <Navigate to="/profile" replace />)  ) : (
          <LoginPage
              onLogin={(user) => {
              console.log('Logged user info:', user);
              setIsAuthenticated(true);
              setUser(user);
              setUserType(user.type);
              if (user.type === 'visitor') {
                navigate('/visitor-dashboard', { replace: true });
              } else {
                navigate('/profile', { replace: true });
              }
            }} />
                )
              }
            />
            <Route path="/visitor-signup" element={<VisitorSignUpPage />} />
            <Route path="/visitor-login" element={<LoginPage />} />
            <Route path="/visitors" element={isAuthenticated ? <VisitorsPage /> : <Navigate to="/login" replace />} />
            <Route  path="/" element={ isAuthenticated ? (  userType === 'visitor' ?
             (<Navigate to="/visitor-dashboard" replace />  ) : (   <Navigate to="/profile" replace />)) : (<Navigate to="/login" replace />)}/>
            <Route path="/profile"element={ isAuthenticated && userType !== 'visitor' ? 
            ( <ProfilePage /> ) : (  <Navigate to={isAuthenticated ? '/visitor-dashboard' : '/login'} replace />)}  />
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
            <Route path="/prisoner_work" element={isAuthenticated ? <PrisonerWorkPage /> : <Navigate to="/login" replace />} />
            <Route path="/transport_staff" element={isAuthenticated ? <TransportStaffPage /> : <Navigate to="/login" replace />} />
            <Route path="/paroles" element={isAuthenticated ? <ParolePage /> : <Navigate to="/login" replace />} />
            <Route path="/cases" element={isAuthenticated ? <CasesPage /> : <Navigate to="/login" replace />} />
            <Route path="/prisoner_movements" element={isAuthenticated ? <PrisonerMovementsPage /> : <Navigate to="/login" replace />} />
            <Route path="/court_hearings" element={isAuthenticated ? <CourtHearingPage /> : <Navigate to="/login" replace />} />
            <Route path="/kitchen_staff" element={isAuthenticated ? <KitchenStaffPage /> : <Navigate to="/login" replace />} />
            <Route path="/guard_staff" element={isAuthenticated ? <GuardStaffPage /> : <Navigate to="/login" replace />} />
            <Route path="/incidents" element={isAuthenticated ? <IncidentsPage /> : <Navigate to="/login" replace />} />
            <Route path="/security_logs" element={isAuthenticated ? <SecurityLogsPage /> : <Navigate to="/login" replace />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/staff_schedule/users/:userID" element={isAuthenticated ? <UserScheduleList /> : <Navigate to="/login" replace />} />
            <Route path="/prisoner_calls" element={isAuthenticated ? <PrisonerCallPage /> : <Navigate to="/login" replace />} />
            <Route path="/maintenance_staff" element={isAuthenticated ? <MaintenanceStaffPage /> : <Navigate to="/login" replace />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/medical_staff" element={isAuthenticated ? <MedicalStaffPage /> : <Navigate to="/login" replace />} />
            <Route path="/appointments" element={isAuthenticated ? <AppointmentsPage /> : <Navigate to="/login" replace />} />
           <Route path="/medical_records" element={isAuthenticated ? <MedicalRecordsPage /> : <Navigate to="/login" replace />} />
            <Route path="/visitor-dashboard" element={isAuthenticated && userType === 'visitor' ? <VisitorDashboard /> : <Navigate to="/login" replace />} />
            <Route path="/visit-requests" element={isAuthenticated ? ( <VisitRequestsPage />) : (  <Navigate to="/login" replace />)}/>
            <Route path="/visits" element={isAuthenticated ? ( <VisitsPage />) : (  <Navigate to="/login" replace />)}/>
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
