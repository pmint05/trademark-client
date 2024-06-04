import {
	ArrowLeftOutlined,
	KeyOutlined,
	UserOutlined,
} from "@ant-design/icons";
import { Button, Checkbox, ConfigProvider, Form, Input } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
function Login() {
	const { user, login } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const { from } = location.state || { from: { pathname: "/" } };

  const onFinish = async (values) => {
    try {
      const response = await axios.post("http://localhost:3000/api/login", values);
      const { success, role, token, message } = response.data;

      if (success) {
				
        login({ role, token });

        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
					console.log(message);
          navigate(from);
        }
      } else {
        console.error(message); // Handle error messages appropriately
      }
    } catch (error) {
      console.error("Error logging in:", error);
      // Handle error cases, such as network errors
    }
  };

	const onFinishFailed = (errorInfo) => {
		console.log("Failed:", errorInfo);
	};
	return (
		<div className="h-screen flex items-center justify-center flex-col text-gray-200">
			<div className="fixed top-4 left-4">
				<Link to="/" className="flex items-center gap-2">
					<ArrowLeftOutlined className="text-2xl" /> Quay lại trang
					chủ
				</Link>
			</div>
			<header>
				<center>
					<h1 className="font-black text-4xl">Logo</h1>
					<p>Đăng nhập tài khoản TradeMark</p>
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
					name="user-login"
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
						label="Email"
						name="email"
						rules={[
							{
								required: true,
								message: "Email is requred!",
							},
							{
								type: "email",
								message: "Email is not valid!",
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
						wrapperCol={{
							offset: 8,
							span: 16,
						}}
					>
						<Button type="primary" htmlType="submit">
							Đăng nhập
						</Button>
					</Form.Item>
				</Form>
				<div className="text-center">
					<center>
						<div>
							<Link to="/auth/forgot-password" className="">
								Quên mật khẩu?
							</Link>
						</div>
						<div>
							Chưa có tài khoản?{" "}
							<Link to="/auth/register" className="font-bold">
								Đăng ký
							</Link>
						</div>
					</center>
				</div>
			</ConfigProvider>
		</div>
	);
}

export default Login;
