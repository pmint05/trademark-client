import {
	CloseOutlined,
	FacebookFilled,
	InstagramFilled,
	MailFilled,
	MenuOutlined,
	MoonOutlined,
	SunOutlined,
	UserOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useBlockScroll } from "../../hooks";
import { useAuth } from "../../context/AuthContext";
import formatLongNum from "../../helper/formatLongNum";
import axios from "axios";
function Navbar() {
	const { user } = useAuth();
	const [userInfo, setUserInfo] = useState(null);
	const [wallet, setWallet] = useState({});
	useEffect(() => {
		if (!user) return;
		axios.get("https://api.trademarkk.com.vn/api/users").then((res) => {
			const _info = res.data.find(
				(item) => item.username === user.username
			);
			setUserInfo(_info);
		});
		axios
			.get(`https://api.trademarkk.com.vn/api/wallet/${user.username}`)
			.then((res) => {
				if (res.data.success) {
					setWallet(res.data.wallet);
				} else {
					setWallet({
						coins: [],
						balance: 0,
					});
				}
			});
	}, [user]);

	const links = [
		{
			id: 1,
			text: "Home",
			url: "/",
		},
		{
			id: 2,
			text: "About",
			url: "/about",
		},
		{
			id: 3,
			text: "Services",
			url: "/services",
		},
		{
			id: 4,
			text: "Pricing",
			url: "/pricing",
		},
	];
	const [showMenu, setShowMenu] = useState(false);
	const [isDarkMode, setIsDarkMode] = useState(false);
	const [blockScroll, enableScroll, isBlocked] = useBlockScroll();
	const handleToggleMenu = () => {
		if (showMenu) {
			enableScroll();
		} else {
			blockScroll();
		}
		setShowMenu(!showMenu);
	};
	return (
		<nav
			id="navbar"
			className="flex justify-center fixed top-0 left-0 w-full bg-gray-900 text-white p-3 z-50 shadow-md"
		>
			<div className="w-full flex justify-between lg:max-w-4xl xl:max-w-6xl">
				<div className="logo">
					<Link to="/">
						<img
							src="/image/logo-light.png"
							alt="logo"
							className="w-16"
						/>
					</Link>
				</div>
				{/* MOBILE NAV */}
				<div className="mobile flex items-center md:hidden">
					<div className="theme-toggle rounded-full transition hover:bg-slate-700 h-8 w-8 flex items-center justify-center">
						<button onClick={() => setIsDarkMode(!isDarkMode)}>
							{isDarkMode ? <MoonOutlined /> : <SunOutlined />}
						</button>
					</div>
					<div className="menu-toggle rounded-full transition hover:bg-slate-700 h-8 w-8 flex items-center justify-center">
						<button onClick={() => handleToggleMenu()}>
							<MenuOutlined />
						</button>
					</div>
					<div
						className={`menu ${
							showMenu ? "translate-x-0" : "translate-x-full"
						} fixed transition-all overflow-hidden left-0 top-0 right-0 bottom-0 bg-slate-900 flex items-center justify-center`}
					>
						<button
							onClick={() => handleToggleMenu()}
							className="absolute top-3 right-3 text-xl"
						>
							<CloseOutlined />
						</button>
						<div className="links flex flex-col justify-center items-center gap-2 text-xl">
							{user ? (
								<Link
									to="/profile"
									className="hover:text-blue-500"
								>
									<UserOutlined /> {userInfo && userInfo.name}
								</Link>
							) : (
								<>
									<Link
										to="/auth/login"
										className="rounded-md bg-blue-500 text-white px-4 py-1"
									>
										Login
									</Link>
									<Link
										to="/auth/register"
										className="rounded-md ring-blue-500 ring-2 text-white px-4 py-1 my-2"
									>
										Register
									</Link>
								</>
							)}
							{userInfo && userInfo.roles.includes("admin") && (
								<Link
									to="/admin/dashboard"
									className="hover:text-blue-500"
								>
									Admin
								</Link>
							)}
							{links.map((link) => (
								<Link
									key={link.id}
									to={link.url}
									onClick={() => handleToggleMenu()}
									className="hover:text-blue-500"
								>
									{link.text}
								</Link>
							))}
							<div className="social mt-4 text-xl flex gap-2">
								<Link to="mailto:contact@example.com">
									<MailFilled />
								</Link>
								<Link to="https://facebook.com">
									<FacebookFilled />
								</Link>
								<Link to="https://instagram.com">
									<InstagramFilled />
								</Link>
							</div>
						</div>
					</div>
				</div>
				{/* PC NAV */}
				<div className="pc hidden md:flex items-center gap-4">
					{userInfo && userInfo.roles.includes("admin") && (
						<Link
							to="/admin/dashboard"
							className="hover:text-blue-500"
						>
							Admin
						</Link>
					)}
					{links.map((link) => (
						<Link
							key={link.id}
							to={link.url}
							className="transition hover:text-blue-500"
						>
							{link.text}
						</Link>
					))}
					<div>
						{user ? (
							<>
								<Link
									to="/profile"
									className="hover:text-blue-500"
								>
									<UserOutlined /> {userInfo && userInfo.name}
								</Link>
								<span className="bg-slate-600 text-center px-2 py-1 rounded-lg ml-2">
									{wallet && formatLongNum(wallet.balance)}{" "}
									VNĐ
								</span>
							</>
						) : (
							<>
								<Link
									to="/auth/register"
									className="rounded-md ring-blue-500 ring-2 text-white px-4 py-1 mr-2"
								>
									Register
								</Link>
								<Link
									to="/auth/login"
									className="rounded-md bg-blue-500 ring-blue-500 ring-2 text-white px-4 py-1"
								>
									Login
								</Link>
							</>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
}

export default Navbar;
