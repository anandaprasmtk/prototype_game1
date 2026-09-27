import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Learn from './pages/Learn';
import Lesson from './pages/Lesson';
import Quest from './pages/Quest';
import TKA from './pages/TKA';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/learn" element={<PrivateRoute><Learn /></PrivateRoute>} />
        <Route path="/learn/:topicId/:lessonId" element={<PrivateRoute><Lesson /></PrivateRoute>} />
        <Route path="/quest" element={<PrivateRoute><Quest /></PrivateRoute>} />
        <Route path="/tka" element={<PrivateRoute><TKA /></PrivateRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
