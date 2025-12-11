import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';

function App() {
  const { user, logout } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
        <Route 
          path="/dashboard" 
          element={
            user ? (
              <div>
                <h1>Welcome {user.firstName} {user.lastName}</h1>
                <p>Email: {user.email}</p>
                <p>Role: {user.role}</p>
                <button onClick={logout}>Logout</button>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
