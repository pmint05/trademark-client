import { Fragment } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";

import "./App.css";

import { PUBLIC_ROUTES, PRIVATE_ROUTES, PREVENT_RELOGIN } from "@/routes";
import { DefaultLayout } from "@/components/layouts";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
function App() {
	return (
		<AuthProvider>
			<Router>
				<div className="App">
					<Routes>
						{PUBLIC_ROUTES.map((r, i) => {
							let Layout = DefaultLayout;
							if (r.layout) {
								Layout = r.layout;
							} else if (r.layout === null) {
								Layout = Fragment;
							}

							const Page = r.element;
							if (
								PREVENT_RELOGIN.includes(r.path) &&
								localStorage.getItem("token")
							) {
								return (
									<Route
										key={i}
										path={r.path}
										element={
											<Navigate to={r.fallback} replace />
										}
									></Route>
								);
							}
							return (
								<Route
									key={i}
									path={r.path}
									element={
										<Layout>
											<Page />
										</Layout>
									}
								></Route>
							);
						})}
						{PRIVATE_ROUTES.map((r, i) => {
							let Layout = DefaultLayout;
							if (r.layout) {
								Layout = r.layout;
							} else if (r.layout === null) {
								Layout = Fragment;
							}

							const Page = r.element;

							return (
								<Route
									key={i}
									path={r.path}
									element={
										<ProtectedRoute
											roles={r.roles}
											fallback={r.fallback}
											{...r}
										>
											<Layout>
												<Page />
											</Layout>
										</ProtectedRoute>
									}
								></Route>
							);
						})}
					</Routes>
				</div>
			</Router>
		</AuthProvider>
	);
}
export default App;
