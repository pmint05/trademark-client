import { useState, useEffect } from "react";
import {
	Row,
	Col,
	Card,
	Table,
	Button,
	Select,
	Input,
	Tag,
	Drawer,
	Space,
	Form,
	Modal,
} from "antd";
import axios from "axios";
import {
	DeleteOutlined,
	EditOutlined,
	MinusCircleOutlined,
	PlusOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Option } = Select;

function Users() {
	const [users, setUsers] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [searchField, setSearchField] = useState("name");
	const userLength = 50;
	useEffect(() => {
		// Fetch users from API
		// axios
		// 	.get("/api/users")
		// 	.then((response) => {
		// 		setUsers(response.data);
		// 	})
		// 	.catch((error) => {
		// 		console.error("Error fetching users", error);
		// 	});
		const status = ["Active", "Verified", "Unverified", "Banned"];
		setUsers(
			Array.from({ length: userLength }, (_, index) => ({
				id: index + 1,
				order: index + 1,
				username: `userabcxyz${index}`,
				name: `User ${index + 1}`,
				email: `user${index + 1}@gmai.com`,
				bankName: "Vietcombank",
				bankAccount: "0123456789",
				status: status[Math.floor(Math.random() * status.length)],
				wallet: [
					{
						code: "BTC",
						balance: 0.0001,
					},
					{
						code: "ETH",
						balance: 0.001,
					},
					{
						code: "USDT",
						balance: 1,
					},
				],
				totalTransactions: Math.floor(Math.random() * 100000),
			}))
		);
	}, []);
	const [open, setOpen] = useState(false);
	const [initialValues, setInitialValues] = useState({});
	const columns = [
		{
			title: "Order",
			dataIndex: "order",
			key: "order",
			sorter: (a, b) => a.order - b.order,
			width: 80,
		},
		{
			title: "Username",
			dataIndex: "username",
			key: "username",
			width: 120,
		},
		{
			title: "Name",
			dataIndex: "name",
			key: "name",
		},
		{
			title: "Status",
			dataIndex: "status",
			key: "status",
			width: 80,
			filters: [
				{
					text: "Active",
					value: "Active",
				},
				{
					text: "Verified",
					value: "Verified",
				},
				{
					text: "Unverified",
					value: "Unverified",
				},
				{
					text: "Banned",
					value: "Banned",
				},
			],
			onFilter: (value, record) => record.status.indexOf(value) === 0,
			render: (status) => {
				let color = "";
				switch (status) {
					case "Active":
						color = "green";
						break;
					case "Verified":
						color = "blue";
						break;
					case "Unverified":
						color = "orange";
						break;
					case "Banned":
						color = "red";
						break;
					default:
						color = "gray";
				}
				return <Tag color={color}>{status.toUpperCase()}</Tag>;
			},
		},
		{
			title: "Wallet",
			dataIndex: "wallet",
			key: "wallet",
			render: (wallet) => (
				<div>
					{wallet.map((coin) => (
						<div key={coin.code}>
							{coin.code}: {coin.balance}
						</div>
					))}
				</div>
			),
		},
		{
			title: "Total Transactions",
			dataIndex: "totalTransactions",
			key: "totalTransactions",
			width: 180,
			sorter: (a, b) => a.totalTransactions - b.totalTransactions,
			render: (totalTransactions) => (
				<div>{totalTransactions.toLocaleString()} VND</div>
			),
		},
		{
			title: "Action",
			key: "action",
			width: 80,
			render: (_, record) => (
				<Button type="link" onClick={() => handleShowUser(record)}>
					view
				</Button>
			),
		},
	];

	const handleShowUser = (record) => {
		setInitialValues(record);
		setOpen(true);
	};
	const handleCloseUser = () => {
		setInitialValues({});
		setOpen(false);
	};
	const handleSaveUser = (user) => {};
	const handleSearch = (event) => {
		setSearchTerm(event.target.value);
	};

	const handleSelect = (value) => {
		setSearchField(value);
	};

	const filteredUsers = users.filter((user) =>
		String(user[searchField])
			.toLowerCase()
			.includes(searchTerm.toLowerCase())
	);
	return (
		<div>
			<Row gutter={[16, 10]}>
				<Col xs={24} sm={12} md={12} lg={6} xl={6}>
					<Card title="Active Users">
						<h1 className="font-bold text-2xl text-green-500">
							{Math.floor(Math.random() * userLength)}
						</h1>
					</Card>
				</Col>
				<Col xs={24} sm={12} md={12} lg={6} xl={6}>
					<Card title="Verified Users">
						<h1 className="font-bold text-2xl text-blue-500">
							{Math.floor(Math.random() * userLength)}
						</h1>
					</Card>
				</Col>
				<Col xs={24} sm={12} md={12} lg={6} xl={6}>
					<Card title="Unverified Users">
						<h1 className="font-bold text-2xl text-gray-500">
							{Math.floor(Math.random() * userLength)}
						</h1>
					</Card>
				</Col>
				<Col xs={24} sm={12} md={12} lg={6} xl={6}>
					<Card title="Banned Users">
						<h1 className="font-bold text-2xl text-red-500">
							{Math.floor(Math.random() * userLength)}
						</h1>
					</Card>
				</Col>
			</Row>
			<div className="mt-4 p-4 rounded-lg bg-white">
				<Row
					gutter={[16, 10]}
					className="flex items-center justify-start gap-4"
				>
					<div>
						Search by &nbsp;
						<Select defaultValue="name" onChange={handleSelect}>
							<Option value="name">Name</Option>
							<Option value="username">Username</Option>
							<Option value="bankAccount">Bank Account</Option>
							<Option value="email">Email</Option>
						</Select>
					</div>
					<div className="flex-1">
						<Input.Search
							placeholder={`Search by ${searchField}`}
							onChange={handleSearch}
						/>
					</div>
				</Row>
				<Table
					columns={columns}
					dataSource={filteredUsers}
					rowKey="id"
					bordered
					rowSelection={{
						onChange: (selectedRowKeys, selectedRows) => {
							console.log(
								`Selected row keys: ${selectedRowKeys}`,
								"Selected rows: ",
								selectedRows
							);
						},
					}}
					pagination={{
						defaultPageSize: 10,
						showSizeChanger: true,
						position: ["topRight"],
					}}
					scroll={{ y: 420, x: true }}
				/>
			</div>
			<UserInfoDrawerForm
				open={open}
				onClose={handleCloseUser}
				user={initialValues}
				onSave={handleSaveUser}
			/>
		</div>
	);
}
const UserInfoDrawerForm = ({ open, onClose, onSave, user }) => {
	const [availableCoins, setAvailableCoins] = useState([]);
	const [qrVisible, setQrVisible] = useState(false);
	const [qrCode, setQrCode] = useState("");
	const [form] = Form.useForm();
	useEffect(() => {
		form.setFieldsValue(user);
	});
	const generateQRCode = async () => {
		const bankName = form.getFieldValue("bankName");
		const bankAccount = form.getFieldValue("bankAccount");
		const vietQRImg = `https://img.vietqr.io/image/${bankName}-${bankAccount}-compact.png?addInfo=`;
		setQrCode(vietQRImg);
		setQrVisible(true);
	};
	const handleSave = () => {
		form.validateFields()
			.then((values) => {
				console.log("Form Values:", values);
				onSave(values);
			})
			.catch((info) => {
				console.log("Validate Failed:", info);
			});
	};
	const handleOk = () => {
		setQrVisible(false);
	};
	const handleCancel = () => {
		setQrVisible(false);
	};
	useEffect(() => {
		axios
			.get(
				"https://api.coingecko.com/api/v3/coins/markets?vs_currency=vnd"
			)
			.then((response) => {
				setAvailableCoins(response.data);
			});
	}, []);
	return (
		<Drawer
			title={`${user.name} (${user.username})`}
			width={480}
			onClose={onClose}
			open={open}
			styles={{
				body: {
					paddingBottom: 80,
				},
			}}
			extra={
				<Space>
					<Button onClick={onClose}>Cancel</Button>
					<Button onClick={handleSave} type="primary">
						Save
					</Button>
				</Space>
			}
		>
			<Form layout="vertical" form={form} name="user_form">
				<Row gutter={16}>
					<Col span={12}>
						<Form.Item label="Username" name="username">
							<Input disabled />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item label="Name" name="name">
							<Input />
						</Form.Item>
					</Col>
				</Row>
				<Row>
					<Col span={24}>
						<Form.Item label="Email" name="email">
							<Input />
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={16} className="mb-6">
					<Col lg={8} xs={12}>
						<Form.Item label="Bank name" name="bankName">
							<Input />
						</Form.Item>
					</Col>
					<Col lg={16} xs={12}>
						<Form.Item label="Bank account" name="bankAccount">
							<Input />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Button onClick={generateQRCode} block>
							Generate QR Code
						</Button>
					</Col>
				</Row>
				<Row>
					<Col span={24}>
						<h1>Wallet</h1>
					</Col>
					<Col span={24}>
						<Form.List name="wallet">
							{(fields, { add, remove }) => (
								<>
									<Table
										dataSource={fields}
										pagination={false}
									>
										<Table.Column
											title="Coin Code"
											dataIndex="name"
											key="name"
											render={(text, record, index) => (
												<Form.Item
													{...record}
													key={record.key}
													name={[record.name, "code"]}
													rules={[
														{
															required: true,
															message:
																"Missing coin",
														},
													]}
												>
													<Select
														placeholder="Coin code"
														showSearch
														optionFilterProp="children"
														filterOption={(
															input,
															option
														) =>
															option.children
																.toLowerCase()
																.indexOf(
																	input.toLowerCase()
																) >= 0
														}
													>
														{availableCoins.map(
															(coin) => (
																<Option
																	key={
																		coin.id
																	}
																	value={
																		coin.symbol
																	}
																>
																	{coin.symbol.toUpperCase()}
																</Option>
															)
														)}
													</Select>
												</Form.Item>
											)}
										/>
										<Table.Column
											title="Balance"
											dataIndex="balance"
											key="balance"
											render={(
												text,
												{ key, ...record },
												index
											) => (
												<Form.Item
													{...record}
													name={[
														record.name,
														"balance",
													]}
													rules={[
														{
															required: true,
															message:
																"Missing balance",
														},
													]}
												>
													<Input placeholder="Balance" />
												</Form.Item>
											)}
										/>
										<Table.Column
											title="Action"
											key="action"
											render={(text, record, index) => (
												<MinusCircleOutlined
													onClick={() =>
														remove(record.name)
													}
												/>
											)}
										/>
									</Table>
									<Form.Item>
										<Button
											type="dashed"
											onClick={() => add()}
											block
											icon={<PlusOutlined />}
										>
											Add coin
										</Button>
									</Form.Item>
								</>
							)}
						</Form.List>
					</Col>
				</Row>
				<Row gutter={16}>
					<Col span={12}>
						<Form.Item
							label="Total Transactions"
							name="totalTransactions"
						>
							<Input addonAfter="VND" />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item label="Status" name="status">
							<Select>
								<Option value="Active">Active</Option>
								<Option value="Verified">Verified</Option>
								<Option value="Unverified">Unverified</Option>
								<Option value="Banned">Banned</Option>
							</Select>
						</Form.Item>
					</Col>
				</Row>
				<Row>
					<Col span={24}>
						<h1>Danger zone</h1>
					</Col>
					<Col span={24}>
						<Button
							type="danger"
							icon={<DeleteOutlined />}
							className="hover:text-red-500"
							block
							onClick={() => {
								Modal.confirm({
									title: "Delete User",
									content:
										"Are you sure you want to delete this user?",
									onOk() {
										console.log("Delete user", user);
									},
								});
							}}
						>
							Delete User
						</Button>
					</Col>
				</Row>
			</Form>
			<Modal
				title="QR Code"
				open={qrVisible}
				onOk={handleOk}
				onCancel={handleCancel}
			>
				<img src={qrCode} alt="QR Code" />
			</Modal>
		</Drawer>
	);
};
export default Users;
