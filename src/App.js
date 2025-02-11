import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './pages/Login.jsx';
import Search from './pages/Search2.jsx';
import Match from './pages/Match.jsx';
import ProtectedRoutes from './components/ProtectedRoute.jsx';

function App() {
  const [favDogs, setFavDogs] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const onLogin = () => {
    setIsAuthenticated(true);
  }

  const onLogout = async() => {
    try {
			const logoutResponse = await fetch("https://frontend-take-home-service.fetch.com/auth/logout", {
				method: "POST",
				credentials: "include",
			})

			if (logoutResponse.ok) {
        setIsAuthenticated(false);
			} else {
				throw new Error('Logout response not ok!');
			}
		} catch(error) {
			console.error('Error logout!', error)
		}
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login onLogin={onLogin} />} />
        <Route 
          path="/search" 
          element={<ProtectedRoutes isAuthenticated={isAuthenticated}><Search setFavDogs={setFavDogs} onLogout={onLogout} /> </ProtectedRoutes>} />
        <Route 
          path="/match" 
          element={<ProtectedRoutes isAuthenticated={isAuthenticated}><Match favDogs={favDogs} onLogout={onLogout} /> </ProtectedRoutes>} />
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </Router>
  );
}

export default App;
