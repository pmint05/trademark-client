import Navbar from "../../Navbar";
import { Link } from "react-router-dom";
function DefaultLayout({ children }) {
	return (
		<>
			<Navbar />
			<main>{children}</main>
			<Footer />
		</>
	);
}

function Footer() {
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
	return (
		<footer className="mt-20 bg-slate-900 text-gray-400">
			<div className="flex flex-col md:flex-row md:items-start md:p-8 lg:px-20">
				<div className="text-gray-300 text-center p-4 md:text-justify md:max-w-sm lg:max-w-2xl">
					<h1 className="logo text-xl font-bold">LOGO</h1>
					<p>
						TradeMark là một sàn giao dịch tiền điện tử hàng đầu thế
						giới, cung cấp dịch vụ mua bán tiền điện tử, giao dịch
						tiền điện tử, mua bán tiền điện tử uy tín, chất lượng.
					</p>
				</div>
				<div className="flex justify-center items-center gap-4 mb-4 text-blue-400 md:p-4 md:mb-0 md:flex-col md:gap-2 md:items-end md:flex-1">
					{links.map((link) => (
						<Link to={link.url} key={link.id}>
							{link.text}
						</Link>
					))}
				</div>
			</div>
			<div className="text-center bg-slate-950 py-4">
				<p>
					© 2024{" "}
					<Link to="/" className="text-blue-500">
						TradeMark
					</Link>
					. All rights reserved. <br />
					Designed and developed by{" "}
					<a href="https://t.me/pmint05" target="_blank">
						@pmint05
					</a>
				</p>
			</div>
		</footer>
	);
}

export default DefaultLayout;
