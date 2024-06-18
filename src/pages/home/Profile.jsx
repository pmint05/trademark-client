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
	Empty,
	message,
} from "antd";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import formatLongNum from "../../helper/formatLongNum";

const Profile = () => {
	const { user, logout } = useAuth();
	const [userInfo, setUserInfo] = useState({});
	const [editMode, setEditMode] = useState(false);
	const [currentMarket, setCurrentMarket] = useState([]);
	const [availableBank, setAvailableBank] = useState([]);
	const [walletData, setWalletData] = useState([]);
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
		axios.get("https://api.trademarkk.com.vn/api/users").then((res) => {
			const _info = res.data.find(
				(item) => item.username === user.username
			);
			setUserInfo(_info);
		});
	}, []);

	const [form] = Form.useForm();

	const handleEdit = () => {
		form.setFieldsValue({
			fullName: userInfo.fullName,
			bankName: userInfo.bankName,
			bankNumber: userInfo.bankNumber,
			email: userInfo.email,
		});
		setEditMode(true);
	};

	const handleSave = () => {
		const values = form.getFieldsValue();
		try {
			axios
				.post(
					"https://api.trademarkk.com.vn/api/user/info/update",
					values
				)
				.then((res) => {
					if (res.data.success) {
						message.success("Update successfully!");
						setUserInfo(values);
					} else {
						message.error("Update failed!");
					}
					setEditMode(false);
				});
		} catch (e) {
			message.error("Update failed!");
			console.error("Error: ", e);
		}
	};
	const [wallet, setWallet] = useState({});
	useEffect(() => {
		axios
			.get(`https://api.trademarkk.com.vn/api/wallet/${user.username}`)
			.then((res) => {
				setWallet(res.data.wallet);
				setWalletData(res.data.wallet.coins);
			});
	}, []);
	const [coinPricesInVND, setCoinPricesInVND] = useState({});
	useEffect(() => {
		const fetchCoinPrices = async () => {
			const coinPrices = {};
			for (const coin of walletData) {
				const res = await axios.get(
					`https://api.coinbase.com/v2/exchange-rates?currency=${coin.code}`
				);
				coinPrices[coin.code] = res.data.data.rates.VND;
			}
			setCoinPricesInVND(coinPrices);
		};
		fetchCoinPrices();
	}, [walletData]);
	const columns = [
		{
			title: "Coin Code",
			dataIndex: "code",
			key: "code",
			render: (text, record) => (
				<span className="flex items-center gap-2">{text}</span>
			),
		},
		{
			title: "Balance",
			dataIndex: "balance",
			key: "balance",
			render: (text, record) => (
				<span>
					{text} (
					{(coinPricesInVND[record.code] &&
						(coinPricesInVND[record.code] * text).toLocaleString(
							"vi-VN",
							{
								style: "currency",
								currency: "VND",
							}
						)) ||
						0}
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
				{walletData ? (
					<Table
						dataSource={walletData}
						columns={columns}
						bordered
						pagination={false}
						summary={() => {
							let totalBalance = 0;
							walletData.forEach((coin) => {
								totalBalance +=
									currentMarket?.find(
										(market) =>
											market.symbol ==
											coin.code.toLowerCase()
									)?.current_price * coin.balance;
							});
							return (
								<Table.Summary.Row>
									<Table.Summary.Cell>
										Total (VND)
									</Table.Summary.Cell>
									<Table.Summary.Cell colSpan={2}>
										{totalBalance &&
											(totalBalance.toLocaleString(
												"vi-VN",
												{
													style: "currency",
													currency: "VND",
												}
											) ||
												0)}
									</Table.Summary.Cell>
								</Table.Summary.Row>
							);
						}}
					/>
				) : (
					<Empty description="No data" />
				)}
				{wallet && (
					<div className="text-white flex items-center gap-2 mt-4 px-4 py-2 border min-w-60">
						<h1>Balance</h1>
						<b>
							{wallet.balance && formatLongNum(wallet.balance)}{" "}
							VNĐ
						</b>
					</div>
				)}
				<div className="flex gap-2 mt-4 min-w-60">
					<Button
						type="primary"
						block
						onClick={handleShowDepositModal}
					>
						Deposit
					</Button>
					{walletData && (
						<Button
							type="primary"
							block
							onClick={handleShowWithdrawModal}
						>
							Withdraw
						</Button>
					)}
				</div>
			</div>
			<DepositModal
				open={showDepositModal}
				onCancel={() => setShowDepositModal(false)}
			/>
			<WithdrawModal
				open={showWithdrawModal}
				onCancel={() => setShowWithdrawModal(false)}
				userInfo={userInfo}
			/>
			<div className="mt-10 flex items-center justify-center flex-col">
				<h1 className="text-2xl font-bold text-white mb-4">Profile</h1>
				{editMode ? (
					<Form
						form={form}
						onFinish={handleSave}
						layout="vertical"
						initialValues={userInfo}
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
							name="bankNumber"
							label="Bank Number"
							rules={[
								{
									required: true,
									message: "Please input your bank number!",
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
						{userInfo && (
							<>
								<div className="flex gap-2 justify-between items-center">
									<p>Full Name:</p>
									<b>{userInfo.name}</b>
								</div>
								<div className="flex gap-2 justify-between items-center">
									<p>Bank Name:</p>
									<b>{userInfo.bankName}</b>
								</div>
								<div className="flex gap-2 justify-between items-center">
									<p>Bank Account:</p>
									<b>{userInfo.bankNumber}</b>
								</div>
								<div className="flex gap-2 justify-between items-center">
									<p>Email:</p>
									<b>{userInfo.email}</b>
								</div>
								<Button
									onClick={handleEdit}
									block
									className="mt-4"
									type="dashed"
								>
									Edit
								</Button>
							</>
						)}
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
	const [userInfo, setUserInfo] = useState({});
	const [form] = Form.useForm();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://api.trademarkk.com.vn/api/admin/bank");
        setPayGate(response.data.map(item => ({
          id: item._id,
          bankName: item.name,
          bankNumber: item.account
        })));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
	useEffect(() => {
		axios.get("https://api.trademarkk.com.vn/api/users").then((res) => {
			const _info = res.data.find(
				(item) => item.username === user.username
			);
			setUserInfo(_info);
		});
	}, [user]);

	const [qrCode, setQrCode] = useState({});
	const [qrVisible, setQrVisible] = useState(false);
	const generateQRCode = async () => {
		const isValid = await form.validateFields();
		if (!isValid) return alert("Please select a bank!");
		const { bankName, bankNumber } = JSON.parse(form.getFieldValue("bank"));
		const vietQRImg = `https://img.vietqr.io/image/${bankName}-${bankNumber}-compact.png?addInfo=`;
		setQrCode({
			img: vietQRImg,
			content: `${userInfo.username} - ${String(Date.now()).slice(-6)}`,
		});
		setQrVisible(true);
	};
	const copy = () => {
		navigator.clipboard.writeText(qrCode.content);
		alert("Copied!");
	};
	return (
		<Modal
			open={open}
			title="Deposit"
			footer={null}
			onCancel={onCancel}
			onOk={onCancel}
		>
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
									bankNumber: bank.bankNumber,
								})}
							>
								{bank.bankName} - {bank.bankNumber}
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
const WithdrawModal = ({ open, onCancel, userInfo }) => {
	const MIN_AMOUNT = 100000;
	const [form] = Form.useForm();
	const [max, setMax] = useState(0);
	const [inputValue, setInputValue] = useState(MIN_AMOUNT);
	const handleWithdraw = async () => {
		try {
			const values = await form.validateFields();
			console.log(values);
			// Call API to withdraw
			// ...
			form.resetFields();
			alert("Withdraw successfully!");
			onCancel();
		} catch (errorInfo) {
			console.log("Failed:", errorInfo);
		}
	};
	const [walletData, setWalletData] = useState({});
	useEffect(() => {
		axios
			.get(
				`https://api.trademarkk.com.vn/api/wallet/${userInfo.username}`
			)
			.then((res) => {
				setWalletData(res.data.wallet);
				setMax(res.data.wallet.balance);
			});
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
					Button: {
						colorText: "white",
						colorBgContainer: "transparent",
						colorBg: "#123",
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
						bank: userInfo
							? `${userInfo.bankName} - ${userInfo.bankNumber}`
							: "",
					}}
					onFinish={handleWithdraw}
				>
					<Form.Item
						name="amount"
						label="Amount"
						rules={[
							{
								required: true,
								message: "Please input the amount!",
							},
							({ getFieldValue }) => ({
								validator(_, value) {
									if (
										!value ||
										(value >= MIN_AMOUNT && value <= max)
									) {
										return Promise.resolve();
									}
									if (value < MIN_AMOUNT) {
										return Promise.reject(
											new Error(
												"Minimum amount is 100,000 VND!"
											)
										);
									}
									if (value > max) {
										return Promise.reject(
											new Error("Insufficient balance!")
										);
									}
								},
							}),
						]}
					>
						<div className="flex items-center gap-2">
							<InputNumber
								min={MIN_AMOUNT}
								max={max}
								value={inputValue}
								addonAfter="VND"
							/>
							<Button
								onClick={() => {
									form.setFieldsValue({ amount: max });
									form.validateFields(["amount"]);
								}}
								type="dashed"
							>
								Max
							</Button>
						</div>
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
						<Button type="primary" htmlType="submit">
							Withdraw
						</Button>
					</Form.Item>
				</Form>
			</Modal>
		</ConfigProvider>
	);
};
export default Profile;
