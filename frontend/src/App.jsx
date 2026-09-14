import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateSurvey from './pages/CreateSurvey';
import Results from './pages/Results';
import PublicSurvey from './pages/PublicSurvey';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p>در حال بارگذاری...</p>;
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/s/:id" element={<PublicSurvey />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/surveys/new" element={<PrivateRoute><CreateSurvey /></PrivateRoute>} />
          <Route path="/surveys/:id/results" element={<PrivateRoute><Results /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}