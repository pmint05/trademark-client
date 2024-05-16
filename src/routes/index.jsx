import { Home } from "@/pages/home";
import { Admin, Dashboard, Login } from "@/pages/admin";
const PUBLIC_ROUTES = [
	{
		path: "/",
		element: Home,
		exact: true,
	},
	{
		path: "/admin/login",
		element: Login,
		exact: true,
		layout: null,
		fail: "/admin/dashboard",
	},
];
const PRIVATE_ROUTES = [
	{
		path: "/admin/dashboard",
		element: Dashboard,
		exact: true,
		layout: null,
		fail: "/admin/login",
	},
	// {
	// 	path: "/admin/users",
	// 	element: Users,
	// 	exact: true,
	// },
];
const PREVENT_RELOGIN = ["/admin/login", "/admin/register"];

export { PUBLIC_ROUTES, PRIVATE_ROUTES, PREVENT_RELOGIN };
