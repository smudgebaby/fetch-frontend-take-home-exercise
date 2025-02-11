import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';


const ProtectedRoutes = ({children, isAuthenticated}) => {
	return isAuthenticated ? children : <Navigate to='/' />
}

export default ProtectedRoutes;
