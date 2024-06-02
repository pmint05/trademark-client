import {
	ArrowLeftOutlined,
	KeyOutlined,
	UserOutlined,
} from "@ant-design/icons";
import { Button, Checkbox, ConfigProvider, Form, Input } from "antd";
import { Link } from "react-router-dom";
const onFinish = (values) => {
	console.log("Success:", values);
};
const onFinishFailed = (errorInfo) => {
	console.log("Failed:", errorInfo);
};

function Register() {
	const [form] = Form.useForm();
	const { getFieldValue } = form;
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
						label="Email"
						name="Email"
						rules={[
							{
								required: true,
								message: "Email is requred!",
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
								message: "Password is required!",
							},
						]}
					>
						<Input.Password
							placeholder="password..."
							style={{
								backgroundColor: "transparent !inportant",
							}}
						/>
					</Form.Item>
					<Form.Item
						label="Nhập lại mật khẩu"
						name="password2"
						rules={[
							{
								required: true,
								message: "Password is required!",
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
						<Input.Password
							placeholder="password..."
							style={{
								backgroundColor: "transparent !inportant",
							}}
						/>
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
