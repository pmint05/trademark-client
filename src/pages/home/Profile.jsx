import React, { useEffect, useState } from "react";
import {
	Form,
	Input,
	Button,
	ConfigProvider,
	Table,
	Select,
	Modal,
	Col,
	Slider,
	InputNumber,
	Row,
} from "antd";
import { useAuth } from "../../context/AuthContext";
import { Cryptocon } from "cryptocons";
import axios from "axios";
import { render } from "react-dom";
const Profile = () => {
	const { user, logout } = useAuth();
	const [editMode, setEditMode] = useState(false);
	const [currentMarket, setCurrentMarket] = useState([]);
	const [availableBank, setAvailableBank] = useState([]);

	useEffect(() => {
		axios
			.get(
				"https://api.coingecko.com/api/v3/coins/markets?vs_currency=vnd"
			)
			.then((res) => {
				setCurrentMarket(res.data);
			});
		axios.get("https://api.vietqr.io/v2/banks").then((res) => {
			setAvailableBank(res.data.data);
		});
	}, []);

	const [form] = Form.useForm();

	const handleEdit = () => {
		form.setFieldsValue({
			fullName: user.fullName,
			bankNumber: user.bankNumber,
			bankAccount: user.bankAccount,
			email: user.email,
		});
		setEditMode(true);
	};

	const handleSave = () => {
		// Call API to update user details
		// ...

		setEditMode(false);
	};
	const walletData = [
		{
			key: "1",
			coinIcon: "BitcoinBadge",
			coinCode: "BTC",
			balance: 0.5,
		},
		{
			key: "2",
			coinIcon: "EthereumBadge",
			coinCode: "ETH",
			balance: 2.3,
		},
		{
			key: "3",
			coinIcon: "LitecoinBadge",
			coinCode: "LTC",
			balance: 5.1,
		},
	];

	const columns = [
		{
			title: "Coin Code",
			dataIndex: "coinCode",
			key: "coinCode",
			render: (text, record) => (
				<span className="flex items-center gap-2">
					<Cryptocon
						icon={record.coinIcon}
						badgeRadius={999}
						size={24}
					/>
					{text}
				</span>
			),
		},
		{
			title: "Balance",
			dataIndex: "balance",
			key: "balance",
			render: (text, record) => (
				<span>
					{text} (
					{(
						currentMarket?.find(
							(market) =>
								market.symbol == record.coinCode.toLowerCase()
						)?.current_price * parseFloat(text)
					).toLocaleString("vi-VN", {
						style: "currency",
						currency: "VND",
					})}
					)
				</span>
			),
		},
	];
	const [showDepositModal, setShowDepositModal] = useState(false);
	const handleShowDepositModal = () => {
		setShowDepositModal(true);
	};
	const [showWithdrawModal, setShowWithdrawModal] = useState(false);
	const handleShowWithdrawModal = () => {
		setShowWithdrawModal(true);
	};
	return (
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
					Select: {
						colorBgContainer: "transparent",
						colorTextPlaceholder: "#aaa",
						colorIcon: "white",
						colorText: "white",
						optionSelectedColor: "black",
						colorBgElevated: "cornflowerblue",
					},
					Modal: {
						colorText: "white",
						colorTextHeading: "white",
						colorIcon: "white",
						colorBgElevated: "#123",
					},
					Table: {
						header: {
							backgroundColor: "white",
						},
						colorTextHeading: "white",
						colorBgContainer: "transparent",
						colorText: "white",
					},
				},
			}}
		>
			<div className="mt-20 flex items-center justify-center flex-col">
				<h1 className="font-bold text-2xl text-white mb-4">Wallet</h1>
				<Table
					dataSource={walletData}
					columns={columns}
					bordered
					pagination={false}
					summary={() => {
						let totalBalance = 0;
						walletData.forEach((item) => {
							totalBalance +=
								currentMarket?.find(
									(market) =>
										market.symbol ==
										item.coinCode.toLowerCase()
								)?.current_price * item.balance;
						});
						return (
							<Table.Summary.Row>
								<Table.Summary.Cell>
									Total (VND)
								</Table.Summary.Cell>
								<Table.Summary.Cell colSpan={2}>
									{totalBalance &&
										(totalBalance.toLocaleString("vi-VN", {
											style: "currency",
											currency: "VND",
										}) ||
											0)}
								</Table.Summary.Cell>
							</Table.Summary.Row>
						);
					}}
				/>
				<div className="flex gap-2 mt-4 min-w-64">
					<Button
						type="primary"
						block
						onClick={handleShowDepositModal}
					>
						Deposit
					</Button>
					<Button
						type="primary"
						block
						onClick={handleShowWithdrawModal}
					>
						Withdraw
					</Button>
				</div>
			</div>
			<DepositModal
				open={showDepositModal}
				onCancel={() => setShowDepositModal(false)}
			/>
			<WithdrawModal
				open={showWithdrawModal}
				onCancel={() => setShowWithdrawModal(false)}
			/>
			<div className="mt-10 flex items-center justify-center flex-col">
				<h1 className="text-2xl font-bold text-white mb-4">Profile</h1>
				{editMode ? (
					<Form
						form={form}
						onFinish={handleSave}
						layout="vertical"
						initialValues={user}
					>
						<Form.Item
							name="name"
							label="Full Name"
							rules={[
								{
									required: true,
									message: "Please input your full name!",
								},
							]}
						>
							<Input />
						</Form.Item>
						<Form.Item
							name="bankName"
							label="Bank name"
							rules={[
								{
									required: true,
									message: "Please input your bank name!",
								},
							]}
						>
							<Select placeholder="Select a bank">
								{availableBank.map((bank) => (
									<Select.Option
										key={bank.id}
										value={bank.shortName}
									>
										{bank.shortName}
									</Select.Option>
								))}
							</Select>
						</Form.Item>
						<Form.Item
							name="bankAccount"
							label="Bank Account"
							rules={[
								{
									required: true,
									message: "Please input your bank account!",
								},
							]}
						>
							<Input />
						</Form.Item>
						<Form.Item
							name="email"
							label="Email"
							rules={[
								{
									required: true,
									message: "Please input your email!",
								},
								{
									type: "email",
									message: "The input is not valid E-mail!",
								},
							]}
						>
							<Input />
						</Form.Item>
						<Form.Item className="flex items-center justify-center">
							<Button
								onClick={() => setEditMode(false)}
								className="mr-4"
							>
								Cancel
							</Button>
							<Button type="primary" htmlType="submit">
								Save
							</Button>
						</Form.Item>
					</Form>
				) : (
					<div className="text-white p-4 border rounded-md">
						<p>Full Name: {user.name}</p>
						<p>Bank Name: {user.bankNumber}</p>
						<p>Bank Account: {user.bankAccount}</p>
						<p>Email: {user.email}</p>
						<Button
							onClick={handleEdit}
							block
							className="mt-4"
							type="dashed"
						>
							Edit
						</Button>
					</div>
				)}
				<Button onClick={logout} danger type="text" className="mt-4">
					Logout
				</Button>
			</div>
		</ConfigProvider>
	);
};
const DepositModal = ({ open, onCancel }) => {
	const { user } = useAuth();
	const [payGate, setPayGate] = useState([]);
	const [form] = Form.useForm();
	useEffect(() => {
		setPayGate([
			{
				id: 1,
				bankName: "Vietcombank",
				bankAccount: "0123456789",
			},
			{
				id: 2,
				bankName: "Techcombank",
				bankAccount: "9876543210",
			},
		]);
	}, []);
	const [qrCode, setQrCode] = useState({});
	const [qrVisible, setQrVisible] = useState(false);
	const generateQRCode = async () => {
		const isValid = await form.validateFields();
		if (!isValid) return alert("Please select a bank!");
		const { bankName, bankAccount } = JSON.parse(
			form.getFieldValue("bank")
		);
		const vietQRImg = `https://img.vietqr.io/image/${bankName}-${bankAccount}-compact.png?addInfo=`;
		setQrCode({
			img: vietQRImg,
			content: `${user.name} - ${String(Date.now()).slice(-6)}`,
		});
		setQrVisible(true);
	};
	const copy = () => {
		navigator.clipboard.writeText(qrCode.content);
		alert("Copied!");
	};
	return (
		<Modal open={open} title="Deposit" footer={null} onCancel={onCancel}>
			<Form form={form} layout="vertical">
				<Form.Item
					name="bank"
					label="Deposit Gateway"
					rules={[
						{
							required: true,
							message: "Please select a bank!",
						},
					]}
				>
					<Select placeholder="Select a bank">
						{payGate.map((bank, i) => (
							<Select.Option
								key={bank.id}
								value={JSON.stringify({
									bankName: bank.bankName,
									bankAccount: bank.bankAccount,
								})}
							>
								{bank.bankName} - {bank.bankAccount}
							</Select.Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item>
					<Button
						onClick={generateQRCode}
						type="primary"
						htmlType="submit"
					>
						Generate QR Code
					</Button>
				</Form.Item>
			</Form>
			<Modal open={qrVisible} onCancel={() => setQrVisible(false)}>
				<div className="flex flex-col items-center justify-center">
					<img src={qrCode.img} alt="QR Code" className="h-[300px]" />
					<div className="text-center text-xl mt-4">
						<span className="text-lg">Nội dung chuyển khoản:</span>
						<br />
						<code
							className="bg-gray-500 px-2 py-1 rounded-lg"
							onClick={copy}
						>
							{qrCode.content}
						</code>
						<br />
						<span className="text-sm">Nhấn để copy ND</span>
						<br />
						<span className="text-lg">
							(Ví của bạn sẽ được cập nhật sau khi chuyển khoản
							thành công)
						</span>
					</div>
				</div>
			</Modal>
		</Modal>
	);
};
const WithdrawModal = ({ open, onCancel }) => {
	const { user } = useAuth();
	const [form] = Form.useForm();
	const [currentCoinPrice, setCurrentCoinPrice] = useState([]);
	const [max, setMax] = useState(0);
	const [inputValue, setInputValue] = useState(100000);
	const onChange = (newValue) => {
		setInputValue(newValue);
	};
	const handleWithdraw = async () => {
		const isValid = await form.validateFields();
		if (!isValid) return alert("Please fill in all required fields!");
		// Call API to withdraw
		// ...
		alert("Withdraw successfully!");
		onCancel();
	};
	const walletData = [
		{
			key: "1",
			coinIcon: "BitcoinBadge",
			coinCode: "BTC",
			balance: 0.5,
		},
		{
			key: "2",
			coinIcon: "EthereumBadge",
			coinCode: "ETH",
			balance: 2.3,
		},
		{
			key: "3",
			coinIcon: "LitecoinBadge",
			coinCode: "LTC",
			balance: 5.1,
		},
	];
	useEffect(() => {
		const fetchBalances = async () => {
			let totalBalance = 0;
			for (const item of walletData) {
				const res = await axios.get(
					`https://api.coinbase.com/v2/exchange-rates?currency=${item.coinCode}`
				);
				totalBalance += res.data.data.rates.VND * item.balance;
			}
			setMax(totalBalance);
		};

		fetchBalances();
	}, [open]);
	return (
		<ConfigProvider
			theme={{
				components: {
					Input: {
						colorTextDisabled: "#ddd",
						colorBgContainer: "transparent",
					},
					Slider: {
						railBg: "#789",
						railHoverBg: "#abc",
					},
					InputNumber: {
						colorText: "#ddd",
						colorBgContainer: "transparent",
						colorIcon: "#ddd",
					},
				},
			}}
		>
			<Modal
				open={open}
				title="Withdraw"
				footer={null}
				onCancel={onCancel}
			>
				<Form
					form={form}
					layout="vertical"
					initialValues={{
						bank: `${user.bankName} - ${user.bankAccount}`,
					}}
				>
					<Form.Item
						name="amount"
						label="Amount"
						rules={[
							{
								required: true,
								message: "Please input the amount!",
							},
						]}
					>
						<Row>
							<Col span={12}>
								<Slider
									min={100000}
									max={max}
									onChange={onChange}
									value={
										typeof inputValue === "number"
											? inputValue
											: 0
									}
									tooltip={{
										visible: true,
										placement: "top",
										formatter: (value) =>
											value.toLocaleString("vi-VN", {
												style: "currency",
												currency: "VND",
											}),
									}}
								/>
							</Col>
							<Col span={12}>
								<InputNumber
									min={100000}
									max={max}
									style={{
										margin: "0 16px",
									}}
									value={inputValue}
									onChange={onChange}
									addonAfter="VND"
									formatter={(value) =>
										`${value}`.replace(
											/\B(?=(\d{3})+(?!\d))/g,
											","
										)
									}
								/>
							</Col>
						</Row>
					</Form.Item>
					<Form.Item
						name="bank"
						label="Tài khoản nhận"
						rules={[
							{
								required: true,
								message: "Please input the bank account!",
							},
						]}
					>
						<Input disabled />
					</Form.Item>
					<Form.Item>
						<Button
							onClick={handleWithdraw}
							type="primary"
							htmlType="submit"
						>
							Withdraw
						</Button>
					</Form.Item>
				</Form>
			</Modal>
		</ConfigProvider>
	);
};
export default Profile;
