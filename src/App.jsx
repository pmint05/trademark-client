import { Fragment } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";

import "./App.css";

import { PUBLIC_ROUTES, PRIVATE_ROUTES, PREVENT_RELOGIN } from "@/routes";
import { useAuth } from "./hooks";
import { DefaultLayout } from "@/components/layouts";
function App() {
	return (
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

						return PREVENT_RELOGIN.includes(r.path) ? (
							<Route
								key={i}
								path={r.path}
								element={
									<PreventReLogin to={r.fail}>
										<Layout>
											<Page />
										</Layout>
									</PreventReLogin>
								}
							></Route>
						) : (
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
									<PrivateRoute to={r.fail}>
										<Layout>
											<Page />
										</Layout>
									</PrivateRoute>
								}
							></Route>
						);
					})}
				</Routes>
			</div>
		</Router>
	);
}
function PrivateRoute({ to, children }) {
	const auth = useAuth();
	return !auth ? <Navigate to={to} /> : children;
}
function PreventReLogin({ to, children }) {
	const auth = useAuth();
	return auth ? <Navigate to={to} /> : children;
}
export default App;
