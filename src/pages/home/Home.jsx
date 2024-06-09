import { useEffect, useState } from "react";
import { Cryptocon } from "cryptocons";
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
} from "antd";
import { Link } from "react-router-dom";
const { Search } = Input;
const { Column, ColumnGroup } = Table;
import TradingViewWidget from "../../components/TradingViewWidget";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
function Home() {
	const [topCoins, setTopCoins] = useState([]);
	const [tradeType, setTradeType] = useState("buy");
	const [btc, setBtc] = useState({});
	const [wallet, setWallet] = useState({});
	const [form] = Form.useForm();
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
			.then((res) => {
				if (res.data.success) {
					setWallet(res.data.wallet);
				} else {
					setWallet({
						coins: [],
						balance: 0,
					});
				}
			});
	}, [user]);
	const [coinCodes, setCoinCodes] = useState([]);
	const [coinsToTrade, setCoinsToTrade] = useState([]);
	const [selectedCoin, setSelectedCoin] = useState("");
	const [coinPrice, setCoinPrice] = useState(0);

	const [maxAmount, setMaxAmount] = useState(0);
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
	useEffect(() => {
		if (!user) return;
		if (tradeType == "buy") {
			setCoinsToTrade(coinCodes);
		} else {
			setCoinsToTrade(wallet.coins.map((coin) => coin.code));
		}
	}, [tradeType]);
	const handleTrade = (values) => {
		console.log(values, user);
		if (tradeType == "sell") {
			axios
				.post("https://api.trademarkk.com.vn/api/user/sell/coin", {
					username: user.username,
					coinCode: values.coin,
					amount: values.amount,
				})
				.then((res) => {
					if (res.data.success) {
						form.resetFields();
						setWallet(res.data.wallet);
						message.success(res.data.message);
					} else {
						message.error(res.data.message);
					}
				});
		} else {
			axios
				.post("https://api.trademarkk.com.vn/api/user/buy/coin", {
					username: user.username,
					coinCode: values.coin,
					amount: values.amount,
				})
				.then((res) => {
					if (res.data.success) {
						form.resetFields();
						setWallet(res.data.wallet);
						message.success(res.data.message);
					} else {
						message.error(res.data.message);
					}
				});
		}
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
						});
					return;
				}
				setCoinPrice(res.data.data.rates.USD);
			});
		if (tradeType == "buy") {
			setMaxAmount(wallet.balance / coinPrice);
		} else {
			const coinInWallet = wallet.coins.find(
				(coin) => coin.code == selectedCoin
			);
			if (coinInWallet) {
				setMaxAmount(coinInWallet.balance);
			} else {
				setMaxAmount(0);
			}
		}
	}, [selectedCoin]);
	const handleSearchCoin = (value) => {
		console.log(value);
	};
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
						<div
							className={`trade-type p-1 w-full border rounded-md flex max-w-72 ${
								tradeType == "buy"
									? "border-green-500"
									: "border-orange-500"
							}`}
						>
							<button
								onClick={() => setTradeType("buy")}
								className={`flex-1 text-white text-md font-semibold px-4 py-1 mr-2 rounded-md ${
									tradeType == "buy"
										? "bg-green-500"
										: "bg-transparent"
								}`}
							>
								Mua
							</button>
							<button
								onClick={() => setTradeType("sell")}
								className={`flex-1 text-white text-md font-semibold px-4 py-1 rounded-md ${
									tradeType == "sell"
										? "bg-orange-500"
										: "bg-transparent"
								}`}
							>
								Bán
							</button>
						</div>
						<div className="coinToTrade flex flex-wrap gap-1 text-gray-300 mt-4">
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
								<Form
									name="trade-form"
									initialValues={{ remember: true }}
									onFinish={handleTrade}
									layout="horizontal"
									className="min-w-72"
									form={form}
								>
									<Form.Item
										name="coin"
										rules={[
											{
												required: true,
												message:
													"Please select a coin!",
											},
										]}
										className="w-full"
									>
										<Select
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
											{coinsToTrade &&
												coinsToTrade.map((coin) => (
													<Select.Option
														key={coin}
														value={coin}
													>
														{coin}
													</Select.Option>
												))}
										</Select>
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
												validator: (_, value) => {
													if (value <= 0) {
														return Promise.reject(
															new Error(
																"Amount must be greater than 0"
															)
														);
													}
													if (
														value > maxAmount &&
														tradeType == "sell"
													) {
														return Promise.reject(
															new Error(
																`Amount must be less than or equal to ${maxAmount}`
															)
														);
													}
													return Promise.resolve();
												},
											},
										]}
									>
										<InputNumber
											step={0.01}
											max={
												tradeType == "buy"
													? 100000
													: maxAmount
											}
											placeholder="Số lượng"
											className="w-full"
										/>
									</Form.Item>
									<div className="w-full text-center text-gray-400">
										{tradeType == "sell" &&
											maxAmount != 0 &&
											`Có ${
												wallet.coins.find(
													(coin) =>
														coin.code ==
														selectedCoin
												).balance
											} ${selectedCoin} trong ví`}
									</div>
									<div className="w-full text-center text-gray-400 mb-4">
										{selectedCoin &&
											coinPrice != 0 &&
											`(1 ${selectedCoin} ≈ ${coinPrice} USDT)`}
									</div>
									<Form.Item>
										<Button
											block
											type="primary"
											htmlType="submit"
										>
											{tradeType == "buy" ? "Mua" : "Bán"}
										</Button>
									</Form.Item>
								</Form>
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
						Khám phá tiền điện tử có sẵn trên Vinance
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
		</>
	);
}

export default Home;
