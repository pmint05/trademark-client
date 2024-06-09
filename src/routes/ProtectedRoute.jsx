import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, roles, fallback, ...rest }) => {
	const { user } = useAuth();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (user) {
			setLoading(false);
		}
	}, [user]);

	if (loading) {
		return (
			<div className="fixed top-0 left-0 right-0 bottom-0 bg-slate-800 flex items-center justify-center text-xl font-bold text-white">
				Loading...
			</div>
		); // or your custom loading component
	}

	return user && roles.some((role) => user.roles.includes(role)) ? (
		<>{children}</>
	) : (
		<Navigate to={fallback} replace />
	);
};

export default ProtectedRoute;
