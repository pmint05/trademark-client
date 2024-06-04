import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
const ProtectedRoute = ({ children, roles, fallback, ...rest }) => {
	const { user } = useAuth();
	return user && roles.some((role) => user.roles.includes(role)) ? (
		<>{children}</>
	) : (
		<Navigate to={fallback} replace />
	);
};

export default ProtectedRoute;
