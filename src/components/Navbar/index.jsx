import { MenuOutlined, MoonOutlined } from "@ant-design/icons";

function Navbar() {
	return (
		<nav
			id="navbar"
			className="absolute top-0 left-0 w-full flex justify-between bg-gray-900 text-white p-3"
		>
			<div className="logo">
				<a href="#home">Logo</a>
			</div>
			<div className="mobile flex items-center gap-2 md:hidden">
				<div className="theme-toggle rounded-full bg-slate-700 h-8 w-8 flex items-center justify-center">
					<button>
						<MoonOutlined />
					</button>
				</div>
				<div className="menu-toggle">
					<button>
						<MenuOutlined />
					</button>
				</div>
			</div>
			<div className="pc hidden md:flex items-center gap-4">
				<a href="#home">Home</a>
				<a href="#about">About</a>
				<a href="#services">Services</a>
				<a href="#pricing">Pricing</a>
			</div>
		</nav>
	);
}

export default Navbar;
