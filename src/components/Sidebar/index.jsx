import {
	ApartmentOutlined,
	BankOutlined,
	BellOutlined,
	CreditCardOutlined,
	DollarCircleOutlined,
	HomeOutlined,
	InboxOutlined,
	MenuFoldOutlined,
	MenuOutlined,
	MenuUnfoldOutlined,
	TeamOutlined,
	TransactionOutlined,
	UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, Layout, Menu, Space, theme } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
const { Header, Sider, Content, Footer } = Layout;
import { useAuth } from "../../context/AuthContext";
function Sidebar({ children }) {
	const { user, logout } = useAuth();
	const menuItems = [
		{
			key: 1,
			label: <Link to="/admin">Trang chủ</Link>,
			icon: <HomeOutlined />,
		},
		{
			key: 2,
			label: <Link to="/admin/transactions">Quản lý đơn hàng</Link>,
			icon: <InboxOutlined />,
		},
		{
			key: 3,
			label: <Link to="/admin/currencies">Quản lý tiền tệ</Link>,
			icon: <TransactionOutlined />,
		},
		{
			key: 4,
			label: <Link to="/admin/users">Quản lý người dùng</Link>,
			icon: <TeamOutlined />,
		},
		{
			key: 5,
			label: <Link to="/admin/payment-gateways">Cổng thanh toán</Link>,
			icon: <CreditCardOutlined />,
		},
		{
			key: 6,
			label: <Link to="/admin/deposits">Chuyển tiền</Link>,
			icon: <DollarCircleOutlined />,
		},
	];
	const adminMenu = [
		{
			label: <Link to="/profile">Profile</Link>,
			key: "0",
		},
		{
			label: "Settings",
			key: "1",
		},
		{
			type: "divider",
		},
		{
			label: <button onClick={logout}>Logout</button>,
			key: "3",
		},
	];
	const [collapsed, setCollapsed] = useState(true);
	const {
		token: { colorBgContainer, borderRadiusLG },
	} = theme.useToken();
	return (
		<Layout className="!min-h-screen">
			<Sider
				trigger={null}
				collapsible
				collapsed={collapsed}
				onCollapse={(value) => setCollapsed(value)}
				theme="light"
				style={{
					overflow: "auto",
					height: "100vh",
					position: "fixed",
					left: 0,
					top: 0,
					bottom: 0,
				}}
			>
				<div className="flex items-center justify-center font-black text-xl p-2">
					Admin
				</div>
				<Menu
					theme="light"
					mode="inline"
					defaultSelectedKeys={["1"]}
					items={menuItems}
				/>
			</Sider>
			<Layout
				style={{
					marginLeft: collapsed ? 80 : 200,
					marginTop: 64,
					transition: "margin-left 0.2s",
				}}
			>
				<Header
					style={{
						padding: 0,
						background: colorBgContainer,
						position: "fixed",
						top: 0,
						right: 0,
						left: collapsed ? 80 : 200,
						transition: "left 0.2s",
						zIndex: 999,
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.1)",
					}}
				>
					<div className="logo flex items-center">
						<Button
							type="text"
							icon={
								collapsed ? (
									<MenuUnfoldOutlined />
								) : (
									<MenuFoldOutlined />
								)
							}
							onClick={() => setCollapsed(!collapsed)}
							className="!h-12 !w-12 !text-xl"
						/>
						<h1
							className={`${
								collapsed ? "opacity-100" : "opacity-0"
							} transition-opacity ml-2 text-nowrap`}
						>
							<Link to="/admin" className="font-bold text-md">
								Admin | Logo
							</Link>
						</h1>
					</div>
					<div className="menu flex items-center gap-1 pr-1 md:pr-4">
						<div className="notification flex justify-center items-center">
							<button className="text-xl p-2">
								<BellOutlined size={32} />
							</button>
						</div>
						<div className="user">
							<Dropdown
								menu={{ items: adminMenu }}
								trigger={["click"]}
								className="cursor-pointer"
							>
								<Avatar
									size={28}
									src="https://i.pravatar.cc/300"
								/>
							</Dropdown>
						</div>
					</div>
				</Header>
				<Content
					className={`p-2 min-h-72 bg-gray-100 ${
						collapsed ? "opacity-100" : "opacity-50"
					} transition-opacity`}
				>
					{children}
				</Content>
				<Footer
					style={{
						textAlign: "center",
					}}
				>
					Ant Design ©{new Date().getFullYear()} Created by Ant UED
				</Footer>
			</Layout>
		</Layout>
	);
}

export default Sidebar;
