import { KeyOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input } from "antd";
const onFinish = (values) => {
	console.log("Success:", values);
};
const onFinishFailed = (errorInfo) => {
	console.log("Failed:", errorInfo);
};

function AdminLogin() {
	return (
		<div className="h-screen flex items-center justify-center flex-col">
			<header>
				<center>
					<h1 className="font-black text-4xl">Logo</h1>
					<p>Đăng nhập trang quản trị</p>
				</center>
			</header>
			<Form
				className="p-4"
				name="admin-login"
				labelCol={{
					span: 7,
				}}
				wrapperCol={{
					span: 20,
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
					label="Username"
					name="username"
					rules={[
						{
							required: true,
							message: "Username is requred!",
						},
					]}
				>
					<Input placeholder="username..." />
				</Form.Item>

				<Form.Item
					label="Password"
					name="password"
					rules={[
						{
							required: true,
							message: "Password is required!",
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
						Submit
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
}

export default AdminLogin;
