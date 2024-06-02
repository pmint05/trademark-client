import { createContext, useState, useEffect, useMemo, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(localStorage.getItem("token") || null);
	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			try {
				const decodedToken = jwtDecode(token);
				setUser(decodedToken);
				axios.defaults.headers.common[
					"Authorization"
				] = `Bearer ${token}`;
			} catch (error) {
				console.log(error);
				delete axios.defaults.headers.common["Authorization"];
				logout();
			}
		} else {
			delete axios.defaults.headers.common["Authorization"];
			logout();
		}
	}, [token]);

	const login = (userData) => {
		console.log(userData);
		setUser(userData);
		userData.token =
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwicm9sZXMiOlsidXNlciJdfQ.uM5Q8zppG9tqo0bL2KFHhuw5wnqOwjvbrsRjrbjqgiE";
		localStorage.setItem("token", userData.token);
		setToken(userData.token);
	};

	const register = (userData) => {
		console.log(userData);
		setUser(userData);
		localStorage.setItem("token", userData.token);
		setToken(userData.token);
	};

	const logout = () => {
		console.log("logout");
		setUser(null);
		setToken(null);
		localStorage.removeItem("token");
		delete axios.defaults.headers.common["Authorization"];
	};
	const contextValue = useMemo(
		() => ({ user, login, register, logout }),
		[token, user]
	);
	return (
		<AuthContext.Provider value={contextValue}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
