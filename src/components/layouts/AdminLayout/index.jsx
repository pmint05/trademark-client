import Sidebar from "@/components/Sidebar";
import "./style.css";
import { BellOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
function AdminLayout({ children }) {
	return (
		<>
			<Sidebar> {children} </Sidebar>
		</>
	);
}
export default AdminLayout;
