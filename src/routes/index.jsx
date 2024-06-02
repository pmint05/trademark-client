import { Home, Profile } from "@/pages/home";
import {
	Dashboard,
	AdminLogin,
	Transactions,
	Currencies,
	Users,
	PaymentGateways,
	Deposits,
} from "@/pages/admin";
import { AdminLayout } from "@/components/layouts";
import { Login, Register } from "@/pages/auth";
const PUBLIC_ROUTES = [
	{
		path: "/",
		element: Home,
		exact: true,
		roles: ["user", "admin"],
	},
	{
		path: "/admin/login",
		element: AdminLogin,
		exact: true,
		layout: null,
		fallback: "/admin/dashboard",
		roles: ["admin"],
	},
	{
		path: "/auth/login",
		element: Login,
		exact: true,
		layout: null,
		fallback: "/",
	},
	{
		path: "/auth/register",
		element: Register,
		exact: true,
		layout: null,
		fallback: "/",
	},
	{
		path: "/admin",
		element: AdminLogin,
		exact: true,
		layout: null,
		fallback: "/admin/dashboard",
		roles: ["admin"],
	},
];
const PRIVATE_ROUTES = [
	{
		path: "/admin/dashboard",
		element: Dashboard,
		exact: true,
		layout: AdminLayout,
		fallback: "/admin/login",
		roles: ["admin"],
	},
	{
		path: "/admin/transactions",
		element: Transactions,
		exact: true,
		layout: AdminLayout,
		fallback: "/admin/login",
		roles: ["admin"],
	},
	{
		path: "/admin/currencies",
		element: Currencies,
		exact: true,
		layout: AdminLayout,
		fallback: "/admin/login",
		roles: ["admin"],
	},
	{
		path: "/admin/users",
		element: Users,
		exact: true,
		layout: AdminLayout,
		fallback: "/admin/login",
		roles: ["admin"],
	},
	{
		path: "/admin/payment-gateways",
		element: PaymentGateways,
		exact: true,
		layout: AdminLayout,
		fallback: "/admin/login",
		roles: ["admin"],
	},
	{
		path: "/admin/deposits",
		element: Deposits,
		exact: true,
		layout: AdminLayout,
		fallback: "/admin/login",
		roles: ["admin"],
	},
	{
		path: "/profile",
		element: Profile,
		exact: true,
		roles: ["user", "admin"],
		fallback: "/auth/login",
	},
];
const PREVENT_RELOGIN = [
	"/admin/login",
	"/admin",
	"/auth/login",
	"/auth/register",
];

export { PUBLIC_ROUTES, PRIVATE_ROUTES, PREVENT_RELOGIN };
