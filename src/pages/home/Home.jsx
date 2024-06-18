import { useEffect, useState } from "react";
import {
	Input,
	Table,
	ConfigProvider,
	Form,
	Select,
	Button,
	Col,
	Row,
	InputNumber,
	message,
	Collapse,
	theme,
	Modal,
} from "antd";
import { Link } from "react-router-dom";
const { Search } = Input;
import TradingViewWidget from "../../components/TradingViewWidget";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { CaretRightOutlined } from "@ant-design/icons";
const convertVndToUsd = async (vndAmount) => {
	return await axios
		.get("https://api.coinbase.com/v2/exchange-rates?currency=USD")
		.then((res) => {
			const exchangeRate = res.data.data.rates.VND;
			const usdAmount = vndAmount / exchangeRate;
			return usdAmount;
		})
		.catch((error) => {
			console.error("Error converting VND to USD:", error);
			return 0;
		});
};
const convertUsdToVnd = async (usdAmount) => {
	return await axios
		.get("https://api.coinbase.com/v2/exchange-rates?currency=USD")
		.then((res) => {
			const exchangeRate = res.data.data.rates.VND;
			const vndAmount = usdAmount * exchangeRate;
			return vndAmount;
		})
		.catch((error) => {
			console.error("Error converting USD to VND:", error);
			return 0;
		});
};
function Home() {
	const [topCoins, setTopCoins] = useState([]);
	const [btc, setBtc] = useState({});

	const [wallet, setWallet] = useState({});
	const [buyForm] = Form.useForm();
	const [sellForm] = Form.useForm();
	const [showSuccess, setShowSuccess] = useState(false);
	const [successData, setSuccessData] = useState({});

	const [imgUrl, setImgUrl] = useState("/image/download-lite-dark.svg");
	const { user } = useAuth();
	useEffect(() => {
		axios
			.get("https://api.trademarkk.com.vn/api/coin/list")
			.then((res) => {
				if (res.data.length) {
					setTopCoins(res.data);
				} else {
					console.log("No data");
				}
			})
			.catch((error) => {
				console.error("Error fetching the coins data:", error);
			});
	}, []);
	useEffect(() => {
		if (!user) return;
		axios
			.get(`https://api.trademarkk.com.vn/api/wallet/${user.username}`)
			.then(async (res) => {
				if (res.data.success) {
					// convert vnd wallet balance to usd using API
					const { wallet } = res.data;
					const vndBalance = wallet.balance;
					const usdBalance = await convertVndToUsd(vndBalance);
					setWallet({
						coins: wallet.coins,
						balance: usdBalance,
					});
				} else {
					setWallet({
						coins: [],
						balance: 0,
					});
				}
			});
	}, [user]);
	const [coinCodes, setCoinCodes] = useState([]);
	const [selectedCoin, setSelectedCoin] = useState("");
	const [coinPrice, setCoinPrice] = useState(0);

	const [maxSellAmount, setMaxSellAmount] = useState(0);
	const [maxBuyAmount, setMaxBuyAmount] = useState(0);
	const links = [
		{
			id: 1,
			text: "Home",
			url: "/",
		},
		{
			id: 2,
			text: "About",
			url: "/about",
		},
		{
			id: 3,
			text: "Services",
			url: "/services",
		},
		{
			id: 4,
			text: "Pricing",
			url: "/pricing",
		},
	];
	useEffect(() => {
		if (!wallet) return;
		if (!selectedCoin) return;
		if (!coinPrice) return;
		const coinInWallet = wallet.coins.find(
			(coin) => coin.code == selectedCoin
		);
		setMaxBuyAmount(wallet.balance / coinPrice);
		if (coinInWallet) {
			setMaxSellAmount(coinInWallet.balance);
		} else {
			setMaxSellAmount(0);
		}
	}, [wallet]);
	useEffect(() => {
		try {
			axios.get("https://api.coinlore.net/api/tickers/").then((res) => {
				setBtc(res.data.data[0]);
			});
			axios.get("https://api.trademarkk.com.vn/api/coins").then((res) => {
				if (res.data.success) {
					setCoinCodes(res.data.coins);
				} else {
					setCoinCodes([]);
				}
			});
		} catch (e) {
			setBtc({});
			setCoinCodes([]);
		}
	}, []);
	const handleBuy = (values) => {
		axios
			.post("https://api.trademarkk.com.vn/api/user/buy/coin", {
				username: user.username,
				coinCode: selectedCoin,
				amount: values.amount,
			})
			.then(async (res) => {
				if (res.data.success) {
					setShowSuccess(true);
					setSuccessData({
						coinCode: selectedCoin,
						amount: values.amount,
						amoutInVnd: await convertUsdToVnd(
							values.amount * coinPrice
						),
						tradeType: "buy",
					});
					buyForm.resetFields(["amount"]);
					const { wallet } = res.data;
					const vndBalance = wallet.balance;
					const usdBalance = await convertVndToUsd(vndBalance);
					setWallet({
						coins: wallet.coins,
						balance: usdBalance,
					});
					message.success(res.data.message);
				} else {
					message.error(res.data.message);
				}
			});
	};
	const handleSell = (values) => {
		axios
			.post("https://api.trademarkk.com.vn/api/user/sell/coin", {
				username: user.username,
				coinCode: selectedCoin,
				amount: values.amount,
			})
			.then(async (res) => {
				if (res.data.success) {
					setShowSuccess(true);
					setSuccessData({
						coinCode: selectedCoin,
						amount: values.amount,
						amoutInVnd: await convertUsdToVnd(
							values.amount * coinPrice
						),
						tradeType: "sell",
					});
					sellForm.resetFields(["amount"]);
					const { wallet } = res.data;
					const vndBalance = wallet.balance;
					const usdBalance = await convertVndToUsd(vndBalance);
					setWallet({
						coins: wallet.coins,
						balance: usdBalance,
					});
					message.success(res.data.message);
				} else {
					message.error(res.data.message);
				}
			});
	};
	const handleSetCoin = (value) => {
		setSelectedCoin(value);
	};
	useEffect(() => {
		if (!selectedCoin) return;
		axios
			.get(
				`https://api.coinbase.com/v2/exchange-rates?currency=${selectedCoin}`
			)
			.then((res) => {
				if (!res.data.data.rates.USD) {
					axios
						.get(`https://api.coinlore.net/api/tickers/`)
						.then((res) => {
							const coin = res.data.data.find(
								(coin) => coin.symbol == selectedCoin
							);
							setCoinPrice(coin.price_usd);
							buyForm.setFieldsValue({ price: coin.price_usd });
							sellForm.setFieldsValue({ price: coin.price_usd });
						});
					return;
				}
				setCoinPrice(res.data.data.rates.USD);
				buyForm.setFieldsValue({ price: res.data.data.rates.USD });
				sellForm.setFieldsValue({ price: res.data.data.rates.USD });
			});
		setMaxBuyAmount(wallet.balance / coinPrice);
		const coinInWallet = wallet.coins.find(
			(coin) => coin.code == selectedCoin
		);
		if (coinInWallet) {
			setMaxSellAmount(coinInWallet.balance);
		} else {
			setMaxSellAmount(0);
		}
	}, [selectedCoin]);
	const handleSearchCoin = (value) => {
		console.log(value);
	};
	const getFaqs = (style) => [
		{
			key: 1,
			label: "Sàn giao dịch tiền mã hóa là gì?",
			children: (
				<p className="font-thin text-lg">
					Sàn giao dịch tiền mã hóa là thị trường kỹ thuật số cho phép
					người dùng mua và bán các loại tiền mã hóa như Bitcoin,
					Ethereum và Tether. Sàn giao dịch Trademark là sàn giao dịch
					tiền mã hóa lớn nhất tính theo khối lượng giao dịch.
				</p>
			),
			style,
		},
		{
			key: 2,
			label: "Làm thế nào để mua tiền mã hóa?",
			children: (
				<p className="font-thin text-lg">
					Để mua tiền mã hóa, bạn cần tạo một tài khoản trên sàn giao
					dịch tiền mã hóa, sau đó nạp tiền vào tài khoản và chọn loại
					tiền mã hóa bạn muốn mua.
				</p>
			),
			style,
		},
		{
			key: 3,
			label: "Làm thế nào để bán tiền mã hóa?",
			children: (
				<p className="font-thin text-lg">
					Để bán tiền mã hóa, bạn cần tạo một tài khoản trên sàn giao
					dịch tiền mã hóa, sau đó chuyển tiền mã hóa vào tài khoản và
					chọn loại tiền mã hóa bạn muốn bán.
				</p>
			),
			style,
		},
		{
			key: 4,
			label: "Làm thế nào để rút tiền từ sàn giao dịch?",
			children: (
				<p className="font-thin text-lg">
					Để rút tiền từ sàn giao dịch, bạn cần đăng nhập vào tài
					khoản của mình, chọn loại tiền mã hóa bạn muốn rút và chọn
					số lượng tiền bạn muốn rút.
				</p>
			),
			style,
		},
		{
			key: 5,
			label: "Làm thế nào để tạo một tài khoản trên sàn giao dịch?",
			children: (
				<p className="font-thin text-lg">
					Để tạo một tài khoản trên sàn giao dịch, bạn cần truy cập
					trang chủ của sàn giao dịch, chọn mục đăng ký và điền đầy đủ
					thông tin cá nhân.
				</p>
			),
			style,
		},
		{
			key: 6,
			label: "Cách nạp tiền vào tài khoản trên sàn giao dịch",
			children: (
				<p className="font-thin text-lg">
					Để nạp tiền vào tài khoản trên sàn giao dịch, bạn cần chọn
					loại tiền mã hóa bạn muốn nạp, sau đó chọn phương thức thanh
					toán và nhập số tiền bạn muốn nạp.
				</p>
			),
			style,
		},
		{
			key: 7,
			label: "Cách sinh lời từ tiền mã hóa trên Trademark",
			children: (
				<p className="font-thin text-lg">
					Để sinh lời từ tiền mã hóa trên Trademark, bạn cần mua tiền
					mã hóa khi giá thấp và bán khi giá cao. Bạn cũng có thể
					chuyển tiền mã hóa vào ví lưu trữ để nhận lãi suất hàng
					ngày.
				</p>
			),
			style,
		},
	];
	const { token } = theme.useToken();
	const faqStyle = {
		marginBottom: 20,
		background: "#234",
		borderRadius: token.borderRadiusLG,
		border: "none",
		fontWeight: "bold",
		fontSize: "1.25rem",
	};
	const [count, setCount] = useState(30);

	useEffect(() => {
		const timer = setInterval(() => {
			setCount((prevCount) =>
				prevCount > 0 ? Math.round((prevCount - 0.1) * 10) / 10 : 30
			);
		}, 100);

		return () => clearInterval(timer);
	}, []);
	return (
		<>
			<section
				id="chart"
				className="mt-20 lg:max-w-4xl xl:max-w-6xl mx-auto p-4 lg:p-0"
			>
				<div className="coin-change flex flex-col items-center justify-center md:flex-row md:px-10 bg-slate-700 bg-opacity-50 rounded-lg ring-slate-700 ring-1">
					<div className="coin-code flex flex-col items-center justify-center pt-4 md:pt-0">
						<h1 className="font-bold text-xl text-white md:text-2xl">
							BTC/USTD
						</h1>
					</div>
					<div className="flex flex-wrap justify-between gap-4 w-full p-4 md:px-10">
						<span className="coin-info">
							<p className="text-blue-500">Giá</p>
							<p
								className="text-green-500 font-semibold"
								style={{
									textShadow: "0 0 5px #16a085",
								}}
							>
								${btc.price_usd}
							</p>
						</span>
						<span className="coin-info">
							<p className="text-blue-500">Thay đổi 1H</p>
							<p
								className={`${
									btc.percent_change_1h?.includes("-")
										? "text-red-500"
										: "text-green-500"
								}`}
							>
								{btc.percent_change_1h}
							</p>
						</span>
						<span className="coin-info">
							<p className="text-blue-500">Thay đổi 24H</p>
							<p
								className={`${
									btc.percent_change_24h?.includes("-")
										? "text-red-500"
										: "text-green-500"
								}`}
							>
								{btc.percent_change_24h}
							</p>
						</span>
						<span className="coin-info">
							<p className="text-blue-500">Vốn hóa thị trường</p>
							<p className="text-gray-300 font-semibold">
								$
								{btc.market_cap_usd?.toLocaleString({
									style: "currency",
									currency: "USD",
								})}
							</p>
						</span>
					</div>
				</div>
				<TradingViewWidget />
			</section>
			<section
				id="quick-trade"
				className="mt-10 lg:max-w-4xl xl:max-w-6xl mx-auto"
			>
				<div className="bg-slate-700 p-4">
					<h1 className="font-bold text-white text-xl">
						Cùng nhau giao dịch thông minh hơn: <br />
						<span className="text-blue-500">P2P</span> Cuộc cách
						mạng giao dịch bắt đầu.
					</h1>
					<p className="text-gray-400 text-lg font-semibold">
						Mua và bán trên P2P bằng phương thức giao dịch ưa thích
						của bạn
					</p>
				</div>
				{user ? (
					<div className="p-4 lg:py-4 lg:p-0 flex flex-col items-center justify-center">
						<div className="w-full text-gray-300 mt-4">
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
										InputNumber: {
											colorBgContainer: "transparent",
											colorText: "white",
											colorTextPlaceholder: "#aaa",
											colorIcon: "white",
											addonBg: "transparent",
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
									token: {
										colorTextBase: "white",
									},
								}}
							>
								<Row>
									<Col span={24}>
										<Select
											className="w-full mb-4"
											placeholder="Chọn coin"
											onChange={handleSetCoin}
											filterOption={(input, option) =>
												option.children
													.toLowerCase()
													.indexOf(
														input.toLowerCase()
													) >= 0
											}
											showSearch
										>
											{coinCodes &&
												coinCodes.map((coin) => (
													<Select.Option
														key={coin}
														value={coin}
													>
														{coin}
													</Select.Option>
												))}
										</Select>
									</Col>
								</Row>
								<Row gutter={[16, 16]}>
									<Col md={11} xs={24}>
										<Form
											name="buy-form"
											initialValues={{ remember: true }}
											onFinish={handleBuy}
											layout="horizontal"
											form={buyForm}
										>
											<span className="text-gray-300 mb-2">
												Khả dụng:{" "}
												{maxBuyAmount != 0
													? `${Number(
															(
																wallet.balance /
																	coinPrice ||
																0
															).toString()
													  ).toFixed(
															5
													  )} ${selectedCoin}`
													: "0.00000"}
											</span>
											<Form.Item
												name="price"
												className="w-full"
											>
												<InputNumber
													disabled
													addonAfter="USDT"
													addonBefore="Giá"
													className="w-full"
												/>
											</Form.Item>
											<Form.Item
												name="amount"
												className="w-full"
												rules={[
													{
														required: true,
														message:
															"Please input the amount!",
													},
													{
														validator: (
															_,
															value
														) => {
															if (value <= 0) {
																message.error(
																	"You don't have enough balance"
																);
																return Promise.reject(
																	new Error(
																		"Amount must be greater than 0"
																	)
																);
															}
															if (
																value >
																maxBuyAmount
															) {
																message.error(
																	"Insufficient balance"
																);
																return Promise.reject(
																	new Error(
																		"Insufficient balance"
																	)
																);
															}
															return Promise.resolve();
														},
													},
												]}
											>
												<InputNumber
													step={0.00001}
													max={maxBuyAmount}
													placeholder="0.0000"
													addonBefore="Số lượng"
													className="w-full"
													addonAfter={selectedCoin}
												/>
											</Form.Item>
											<Form.Item>
												<Button
													block
													type="primary"
													htmlType="submit"
												>
													Mua {selectedCoin}
												</Button>
											</Form.Item>
										</Form>
									</Col>
									<Col
										md={2}
										xs={24}
										className="flex items-center justify-center text-center text-lg md:text-md lg:text-xl"
									>
										<div className="flex items-center justify-center font-bold w-full max-w-16 aspect-square bg-blue-600">
											{count.toFixed(0)}s
										</div>
									</Col>
									<Col md={11} xs={24}>
										<Form
											name="sell-form"
											initialValues={{ remember: true }}
											onFinish={handleSell}
											layout="horizontal"
											form={sellForm}
										>
											<span>
												Khả dụng:{" "}
												{wallet &&
													`${Number(
														maxSellAmount.toString()
													).toFixed(
														5
													)} ${selectedCoin}`}
											</span>
											<Form.Item
												name="price"
												className="w-full"
											>
												<InputNumber
													disabled
													addonAfter="USDT"
													addonBefore="Giá"
													className="w-full"
												/>
											</Form.Item>
											<Form.Item
												name="amount"
												className="w-full"
												rules={[
													{
														required: true,
														message:
															"Please input the amount!",
													},
													{
														validator: (
															_,
															value
														) => {
															if (value <= 0) {
																message.error(
																	"You don't have enough balance"
																);
																return Promise.reject(
																	new Error(
																		"Amount must be greater than 0"
																	)
																);
															}
															if (
																value >
																maxSellAmount
															) {
																message.error(
																	"Insufficient balance"
																);
																return Promise.reject(
																	new Error(
																		"Insufficient balance"
																	)
																);
															}
															return Promise.resolve();
														},
													},
												]}
											>
												<InputNumber
													step={0.00001}
													max={maxSellAmount}
													placeholder="0.0000"
													addonBefore="Số lượng"
													className="w-full"
													addonAfter={selectedCoin}
												/>
											</Form.Item>
											<Form.Item>
												<Button
													block
													type="primary"
													htmlType="submit"
												>
													Bán {selectedCoin}
												</Button>
											</Form.Item>
										</Form>
									</Col>
								</Row>
							</ConfigProvider>
						</div>
					</div>
				) : (
					<div className="block mx-auto mt-4 text-center w-72 text-white">
						<p className="font-bold text-xl">
							Bạn cần có tài khoản để thực hiện giao dịch
						</p>
						<div className="flex items-center justify-center gap-2 mt-4">
							<Link
								to="/auth/register"
								className="px-2 py-1 rounded-md ring-blue-500 ring-2"
							>
								Đăng ký
							</Link>
							<Link
								to="/auth/login"
								className="px-2 py-1 rounded-md bg-blue-500"
							>
								Đăng nhập
							</Link>
						</div>
					</div>
				)}
			</section>
			<section
				id="search-coin"
				className="lg:px-0 mt-10 lg:max-w-4xl xl:max-w-6xl mx-auto md:px-8 p-4"
			>
				<div className="">
					<h2 className="font-bold text-2xl text-white">
						Tiền điện tử
					</h2>
					<p className="text-gray-400 text-sm mb-2">
						Khám phá tiền điện tử có sẵn trên Trademarkk
					</p>
					<ConfigProvider
						theme={{
							components: {
								Input: {
									colorBgContainer: "transparent",
									colorText: "white",
									colorTextPlaceholder: "#aaa",
									colorIcon: "white",
									colorBorder: "#567",
									colorBorderBg: "#567",
								},
							},
						}}
					>
						<Search
							className="w-64"
							placeholder="Tìm kiếm tiền điện tử"
							onSearch={handleSearchCoin}
						/>
					</ConfigProvider>
				</div>
				<div className="mt-8 lg:mt-4 md:flex items-start gap-4">
					<div className="top-coin bg-slate-900 rounded-xl p-4 flex-1 h-full">
						<h3 className="text-gray-300 mb-2">
							Trao đổi hàng đầu
						</h3>
						<table className="w-full text-white border-separate border-spacing-y-4">
							<tbody>
								{topCoins &&
									topCoins.map((coin) => (
										<tr key={coin?.id}>
											<td className="text-left flex items-center gap-2">
												<img
													src={coin?.image}
													alt={coin?.name}
													className="w-6 h-6 mr-2"
												/>
												{coin?.symbol.toUpperCase()}
											</td>
											{/* <td className="text-green-500">{coin.symbol}</td> */}
											<td>{coin?.current_price}</td>
											<td
												className={
													coin?.price_change_percentage_24h >
													0
														? "text-green-500"
														: "text-red-500"
												}
											>
												{
													coin?.price_change_percentage_24h
												}
												%
											</td>
										</tr>
									))}
							</tbody>
						</table>
					</div>
					<div className="hot-coin bg-slate-900 rounded-xl p-4 mt-4 flex-1 h-full md:mt-0">
						<h3 className="text-gray-300 mb-2">Đồng xu nổi bật</h3>
						<table className="w-full text-white border-separate border-spacing-y-4">
							<tbody>
								{topCoins &&
									topCoins.map((coin) => (
										<tr key={coin?.id}>
											<td className="text-left flex items-center gap-2">
												<img
													src={coin?.image}
													alt={coin?.name}
													className="w-6 h-6 mr-2"
												/>
												{coin?.symbol.toUpperCase()}
											</td>
											{/* <td className="text-green-500">{coin.symbol}</td> */}
											<td>{coin?.current_price}</td>
											<td
												className={
													coin?.price_change_percentage_24h >
													0
														? "text-green-500"
														: "text-red-500"
												}
											>
												{
													coin?.price_change_percentage_24h
												}
												%
											</td>
										</tr>
									))}
							</tbody>
						</table>
					</div>
				</div>
			</section>
			<section id="download-app" className="p-4 mt-8">
				<Row gutter={[16, 16]}>
					<Col md={12} xs={24}>
						<div className="h-[496px] md:h-[384px] lg:h-[538px] flex items-center justify-center">
							<img
								src={imgUrl}
								alt=""
								className="h-full w-auto"
							/>
						</div>
						<div className="block mx-auto mt-4 border-b border-gray-700 w-fit">
							<ConfigProvider
								theme={{
									components: {
										Button: {
											colorInfoTextHover: "white",
											colorBgTextHover: "transparent",
										},
									},
									token: {
										colorText: "white",
									},
								}}
							>
								<Button
									type="text"
									className={
										"text-gray-400 border-t-0 border-r-0 border-l-0 rounded-none font-bold " +
										(imgUrl.includes("desktop")
											? "border-blue-500 border-b-2 text-white"
											: "bg-transparent")
									}
									onClick={() =>
										setImgUrl(
											"/image/download-desktop-dark.png"
										)
									}
								>
									Máy tính
								</Button>
								<Button
									type="text"
									className={
										"text-gray-400 border-t-0 border-r-0 border-l-0 rounded-none font-bold " +
										(imgUrl.includes("lite")
											? "border-blue-500 border-b-2 text-white"
											: "bg-transparent")
									}
									onClick={() =>
										setImgUrl(
											"/image/download-lite-dark.svg"
										)
									}
								>
									Lite
								</Button>
								<Button
									type="text"
									className={
										"text-gray-400 border-t-0 border-r-0 border-l-0 rounded-none font-bold " +
										(imgUrl.includes("pro")
											? "border-blue-500 border-b-2 text-white"
											: "bg-transparent")
									}
									onClick={() =>
										setImgUrl(
											"/image/download-pro-dark.svg"
										)
									}
								>
									Pro
								</Button>
							</ConfigProvider>
						</div>
					</Col>
					<Col
						md={12}
						xs={24}
						className="flex flex-col justify-evenly items-stretch"
					>
						<h1 className="font-bold text-white text-xl md:text-left text-center my-6 md:my-0">
							Giao dịch cả khi đang di chuyển. Mọi lúc, mọi nơi
						</h1>
						<div className="flex items-center gap-4">
							<div className="p-3 rounded-2xl border border-slate-400 h-32 aspect-square">
								<img
									src="/image/qr.jpeg"
									alt=""
									className="object-contain rounded-xl w-full h-full"
								/>
							</div>
							<div>
								<p className="text-gray-400 text-lg">
									Quét mã QR để tải ứng dụng
								</p>
								<p className="text-white font-bold text-xl">
									iOS và Android
								</p>
							</div>
						</div>
						<ConfigProvider
							theme={{
								components: {
									Button: {
										colorBgTextHover: "transparent",
										colorInfoTextHover: "white",
										colorText: "white",
									},
								},
							}}
						>
							<div className="flex items-center justify-between gap-2 md:justify-start md:gap-12 mt-4 pr-6">
								<Button
									type="text"
									className="flex flex-col items-center h-fit font-bold text-white"
								>
									<svg
										className="w-8 h-8"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											fillRule="evenodd"
											clip-rule="evenodd"
											d="M15.69 1.978c.133 1.149-.345 2.28-1.046 3.112-.73.819-1.9 1.445-3.037 1.364-.15-1.104.428-2.28 1.073-2.996.73-.815 1.997-1.438 3.01-1.48zm3.64 6.17c-.135.076-2.231 1.27-2.208 3.699.026 2.94 2.707 3.912 2.739 3.922-.015.069-.42 1.403-1.424 2.757-.84 1.193-1.72 2.359-3.116 2.38-.665.014-1.113-.168-1.58-.357-.488-.197-.996-.402-1.79-.402-.843 0-1.374.212-1.886.416-.442.177-.87.349-1.474.372-1.33.047-2.347-1.273-3.217-2.454-1.738-2.413-3.092-6.8-1.277-9.786.88-1.464 2.484-2.406 4.197-2.432.755-.014 1.48.262 2.114.504.485.186.918.35 1.273.35.312 0 .733-.158 1.224-.343.773-.291 1.72-.648 2.683-.552.659.018 2.536.247 3.745 1.924l-.003.002z"
											fill="currentColor"
										></path>
									</svg>
									MacOS
								</Button>
								<Button
									type="text"
									className="flex flex-col items-center h-fit font-bold text-white"
								>
									<svg
										className="w-8 h-8"
										viewBox="0 0 24 25"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M3 3.895h8.533v8.529H3v-8.53zm9.467 0H21v8.529h-8.533v-8.53zM3 13.362h8.533v8.533H3v-8.533zm9.467 0H21v8.533h-8.533"
											fill="currentColor"
										></path>
									</svg>
									Windows
								</Button>
								<Button
									type="text"
									className="flex flex-col items-center h-fit font-bold text-white"
								>
									<svg
										className="w-8 h-8"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											fillRule="evenodd"
											clip-rule="evenodd"
											d="M20.578 18.633c-.553-.23-1.015-.588-.99-1.267.039-.691-.488-1.139-.488-1.139s.463-1.498.039-2.74c-.424-1.24-1.837-3.225-2.917-4.735-1.092-1.51-.167-3.239-1.156-5.453-.99-2.227-3.546-2.087-4.92-1.14-1.375.948-.951 3.29-.887 4.404.064 1.114.026 1.894-.103 2.189-.128.281-1.015 1.344-1.606 2.214-.59.883-1.015 2.714-1.451 3.456-.424.755-.129 1.434-.129 1.434s-.295.102-.527.589c-.23.486-.693.716-1.516.883-.822.166-.822.691-.629 1.28.193.589 0 .909-.231 1.664-.232.742.925.973 2.03 1.1 1.117.129 2.363.846 3.417.986 1.053.128 1.375-.716 1.375-.716s1.182-.27 2.428-.295a10.117 10.117 0 012.428.256s.231.525.655.755c.424.23 1.35.256 1.94-.358.591-.627 2.171-1.408 3.058-1.895.899-.499.745-1.241.18-1.472zM12.895 4.246c.565 0 1.015.55 1.015 1.242 0 .486-.231.909-.566 1.113l-.27-.115c.206-.102.348-.358.348-.653 0-.384-.245-.704-.54-.704-.296 0-.54.32-.54.704 0 .141.039.282.09.397-.18-.064-.334-.128-.462-.18a2.24 2.24 0 01-.09-.575c0-.678.462-1.229 1.015-1.229zm-.064 2.611c.282.103.59.282.565.461-.039.18-.18.18-.565.41-.386.23-1.208.742-1.478.768-.27.038-.41-.115-.694-.295-.282-.179-.809-.614-.68-.844 0 0 .41-.32.59-.474.18-.166.643-.563.925-.512.296.051 1.054.384 1.337.486zm-2.544-2.419c.45 0 .81.525.81 1.178 0 .115-.014.23-.04.333a.828.828 0 00-.32.192c-.052.038-.103.09-.155.128a.824.824 0 00.065-.512c-.065-.359-.296-.615-.527-.576-.231.038-.373.358-.321.716.064.359.295.615.526.576.013 0 .026 0 .039-.012a2.978 2.978 0 01-.321.281c-.321-.153-.566-.601-.566-1.126.013-.653.373-1.178.81-1.178zm-.86 16.487c-.104.473-.656.806-.656.806-.501.154-1.889-.448-2.518-.704-.63-.256-2.236-.346-2.441-.576-.206-.243.103-.755.18-1.254.077-.5-.154-.807-.077-1.152.077-.333 1.104-.333 1.49-.576.398-.23.475-.91.784-1.101.32-.18.886.473 1.13.832.231.358 1.13 1.933 1.49 2.317.373.422.72.934.617 1.408zm5.806-4.544c-.09.46-.09 2.124-.09 2.124s-1.015 1.396-2.595 1.626c-1.58.23-2.364.064-2.364.064l-.886-1.011s.693-.103.59-.781c-.102-.678-2.106-1.626-2.466-2.483-.36-.845-.064-2.279.398-3.008.463-.717.758-2.279 1.208-2.803.462-.525.822-1.626.655-2.125 0 0 .99 1.177 1.67.985.694-.192 2.236-1.33 2.467-1.139.231.192 2.197 4.506 2.39 5.875.192 1.37-.129 2.42-.129 2.42s-.758-.205-.848.256zm5.036 3.072c-.308.281-2.017.96-2.53 1.497-.515.525-1.17.96-1.58.832-.412-.128-.772-.69-.592-1.497.18-.807.334-1.703.309-2.202-.026-.512-.129-1.19 0-1.293.128-.102.333-.051.333-.051s-.102.96.489 1.216c.59.256 1.426-.102 1.683-.358.257-.256.436-.628.436-.628s.257.128.232.538c-.026.41.18.986.565 1.19.373.192.964.474.655.756z"
											fill="currentColor"
										></path>
									</svg>
									Linux
								</Button>
							</div>
							<div>
								<Button
									type="text"
									className="text-gray-400 mt-4 font-bold"
								>
									<svg
										data-slot="icon"
										fill="none"
										stroke-width="1.5"
										stroke="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
										aria-hidden="true"
										className="w-5 h-5 mr-2 inline-block"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859M12 3v8.25m0 0-3-3m3 3 3-3"
										></path>
									</svg>
									Thêm lựa chọn tải xuống
								</Button>
							</div>
						</ConfigProvider>
					</Col>
				</Row>
			</section>
			<section id="faq" className="p-4 mt-8">
				<h1 className="font-bold text-2xl text-white text-center mb-8">
					Câu hỏi thường gặp
				</h1>
				<ConfigProvider
					theme={{
						components: {
							Collapse: {
								colorText: "white",
								colorBgContainer: "transparent",
								colorTextHeading: "white",
							},
						},
					}}
				>
					<Collapse
						className="max-w-2xl mx-auto"
						accordion
						items={getFaqs(faqStyle)}
						expandIcon={({ isActive }) => (
							<CaretRightOutlined
								className="mt-[10px]"
								rotate={isActive ? 90 : 0}
							/>
						)}
						bordered={false}
					></Collapse>
				</ConfigProvider>
			</section>
			<SuccessModal
				visible={showSuccess}
				setVisible={setShowSuccess}
				data={successData}
				setData={setSuccessData}
			/>
		</>
	);
}

const SuccessModal = ({ visible, setVisible, data, setData }) => {
	const { token } = theme.useToken();
	const modalStyle = {
		colorText: "white",
		colorTextHeading: "white",
		colorBgElevated: "#123",
	};
	return (
		<ConfigProvider
			theme={{
				components: {
					Modal: modalStyle,
					Button: { colorText: "white" },
				},
			}}
		>
			<Modal
				title={
					<h1 className="text-center text-xl">
						Giao dịch thành công
					</h1>
				}
				open={visible}
				onOk={() => {
					setVisible(false);
					setData({});
				}}
				closable={false}
				// onCancel={() => {setVisible(false)}}
				footer={[
					<div className="flex justify-center flex-col items-center gap-2">
						<Button
							key="submit"
							type="primary"
							onClick={() => {
								setVisible(false);
								setData({});
							}}
							size="large"
							className="min-w-40"
						>
							Hoàn tất
						</Button>
						<Link to="/profile">
							<Button key="submit" type="text">
								Xem ví
							</Button>
						</Link>
					</div>,
				]}
			>
				<div className="flex items-center justify-center flex-col">
					<img
						src="/image/success-icon.svg"
						alt="success"
						className="w-20 mt-8"
					/>
					{data && (
						<>
							<h1 className="font-medium text-white text-3xl mt-8">
								{Number(data?.amoutInVnd).toLocaleString(
									"vn-VN",
									{
										minimumFractionDigits: 2,
										style: "currency",
										currency: "VND",
									}
								)}
							</h1>
							<p className="mt-2 mb-8">
								{data?.tradeType === "buy"
									? `Mua thành công ${Number(
											data?.amount
									  ).toLocaleString("en", {
											style: "decimal",
											minimumFractionDigits: 2,
									  })} ${data?.coinCode}`
									: `Bán thành công ${Number(
											data?.amount
									  ).toLocaleString("en", {
											style: "decimal",
											minimumFractionDigits: 2,
									  })} ${data?.coinCode}`}
							</p>
						</>
					)}
				</div>
			</Modal>
		</ConfigProvider>
	);
};

export default Home;
