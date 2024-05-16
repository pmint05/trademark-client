import Navbar from "../Navbar";
function DefaultLayout({ children }) {
	return (
		<>
			<Navbar />
			<main>{children}</main>
		</>
	);
}

export default DefaultLayout;
