import {
	ArrowLeftOutlined,
	KeyOutlined,
	UserOutlined,
} from "@ant-design/icons";
import { Button, ConfigProvider, Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios

function Register() {
	const [form] = Form.useForm();
	const { getFieldValue } = form;
	const navigate = useNavigate();
	const onFinish = async (values) => {
		try {
			const response = await axios.post(
				"https://api.trademarkk.com.vn/api/user/create",
				{
					name: values.name,
					roles: ["user"],
					phoneNumber: values.phoneNumber,
					email: values.email,
					password: values.password,
				}
			);

			if (response.data.success) {
				message.success(response.data.message);
				navigate("/auth/login");
			} else {
				message.error(response.data.message);
			}
		} catch (error) {
			console.error("Error during registration:", error);
			message.error(
				"An error occurred during registration. Please try again."
			);
		}
	};

	const onFinishFailed = (errorInfo) => {
		console.log("Failed:", errorInfo);
	};

	return (
		<div className="h-screen flex items-center justify-center flex-col text-white">
			<div className="fixed top-4 left-4">
				<Link to="/" className="flex items-center gap-2">
					<ArrowLeftOutlined className="text-2xl" /> Quay lại trang
					chủ
				</Link>
			</div>
			<header>
				<center>
					<h1 className="font-black text-4xl">Logo</h1>
					<p>Đăng ký tài khoản TradeMark</p>
				</center>
			</header>
			<ConfigProvider
				theme={{
					components: {
						Form: {
							labelColor: "white",
						},
						Input: {
							colorBgContainer: "transparent",
							colorText: "white",
							colorTextPlaceholder: "#aaa",
							colorIcon: "white",
						},
					},
				}}
			>
				<Form
					className="p-4"
					name="user-register"
					form={form}
					labelCol={{
						span: 10,
					}}
					wrapperCol={{
						span: 24,
					}}
					initialValues={{
						remember: true,
					}}
					colon={false}
					onFinish={onFinish}
					onFinishFailed={onFinishFailed}
					autoComplete="off"
				>
					<Form.Item
						label="Tên"
						name="name"
						rules={[
							{
								required: true,
								message: "Tên là bắt buộc!",
							},
						]}
					>
						<Input placeholder="name..." />
					</Form.Item>

					<Form.Item
						label="Số điện thoại"
						name="phoneNumber"
						rules={[
							{
								required: true,
								message: "Số điện thoại là bắt buộc!",
							},
							{
								pattern: /^\d+$/,
								message: "Số điện thoại không hợp lệ!",
							},
						]}
					>
						<Input placeholder="phone number..." />
					</Form.Item>

					<Form.Item
						label="Email"
						name="email"
						rules={[
							{
								required: true,
								message: "Email là bắt buộc!",
							},
							{
								type: "email",
								message: "Email không hợp lệ",
							},
						]}
					>
						<Input placeholder="email..." />
					</Form.Item>

					<Form.Item
						label="Mật khẩu"
						name="password"
						rules={[
							{
								required: true,
								message: "Mật khẩu là bắt buộc!",
							},
						]}
					>
						<Input.Password placeholder="password..." />
					</Form.Item>

					<Form.Item
						label="Nhập lại mật khẩu"
						name="password2"
						rules={[
							{
								required: true,
								message: "Mật khẩu là bắt buộc!",
							},
							{
								validator: (_, value) => {
									if (value !== getFieldValue("password")) {
										return Promise.reject(
											"Mật khẩu không khớp"
										);
									}
									return Promise.resolve();
								},
							},
						]}
					>
						<Input.Password placeholder="password..." />
					</Form.Item>

					<Form.Item
						wrapperCol={{
							offset: 8,
							span: 16,
						}}
					>
						<Button type="primary" htmlType="submit">
							Đăng ký
						</Button>
					</Form.Item>
				</Form>
				<div className="text-center">
					<center>
						<Link to="/auth/login" className="underline">
							Đăng nhập
						</Link>
					</center>
				</div>
			</ConfigProvider>
		</div>
	);
}

export default Register;
