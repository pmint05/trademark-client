import { useEffect, useState } from "react";
import { Cryptocon } from "cryptocons";
import { Input, Table, ConfigProvider } from "antd";
import { Link } from "react-router-dom";
const { Search } = Input;
const { Column, ColumnGroup } = Table;
import TradingViewWidget from "../../components/TradingViewWidget";
import axios from "axios";
function Home() {

	const [topCoins, setTopCoins] = useState([]);
	useEffect(() => {
		axios.get("http://localhost:3000/api/coin/list")
				.then((res) => {
						const fetchedCoins = res.data.map((coin, index) => ({
								key: index + 1,
								code: coin.symbol.toUpperCase(),
								icon: coin.name.replace(" ", "") + "Badge",
								change: `${coin.price_change_percentage_24h > 0 ? "+" : ""}${coin.price_change_percentage_24h.toFixed(2)}%`,
								price: `$${coin.current_price.toLocaleString()}`
						}));
						setTopCoins(fetchedCoins);
						console.log(topCoins);
				})
				.catch((error) => {
						console.error("Error fetching the coins data:", error);
				});
}, []);
	const coinCodes = [
		"BTC",
		"ETH",
		"BNB",
		"USDT",
		"ADA",
		"XRP",
		"DOGE",
		"DOT",
		"SOL",
		"UNI",
	];
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
	const [tradeType, setTradeType] = useState("buy");
	const [btc, setBtc] = useState({});
	useEffect(() => {
		axios.get("https://api.coinlore.net/api/tickers/").then((res) => {
			setBtc(res.data.data[0]);
		});
	}, []);
	// const onSearch = (value, _e, info) => console.log(info?.source, value);
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
								{btc.market_cap_usd.toLocaleString({
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
				<div className="p-4 lg:py-4 lg:p-0">
					<div
						className={`trade-type p-1 w-fit border rounded-md ${
							tradeType == "buy"
								? "border-green-500"
								: "border-orange-500"
						}`}
					>
						<button
							onClick={() => setTradeType("buy")}
							className={`text-white text-md font-semibold px-4 py-1 mr-2 rounded-md ${
								tradeType == "buy"
									? "bg-green-500"
									: "bg-transparent"
							}`}
						>
							Mua
						</button>
						<button
							onClick={() => setTradeType("sell")}
							className={`text-white text-md font-semibold px-4 py-1 rounded-md ${
								tradeType == "sell"
									? "bg-orange-500"
									: "bg-transparent"
							}`}
						>
							Bán
						</button>
					</div>
					<div className="coinToTrade flex flex-wrap gap-1 text-gray-300 mt-4">
						{coinCodes.map((coin) => (
							<span
								key={coin}
								className={`px-3 py-1 font-semibold uppercase rounded-md cursor-pointer hover:bg-slate-700 hover:text-slate-300${
									coin == "BTC"
										? "bg-blue-900 text-blue-500"
										: ""
								}`}
							>
								{coin}
							</span>
						))}
					</div>
					<div className="mt-3 grid gap-2 lg:grid-cols-4 md:grid-cols-2 grid-cols-1">
						<input
							type="number"
							name="amount"
							id="tradeAmount"
							min="0"
							placeholder="Nhập số lượng"
							className="bg-none border rounded-md border-gray-400 text-gray-400 w-full py-2 pl-3"
						/>
						<select
							name="coin"
							id="coin"
							className="bg-none border rounded-md border-gray-400 text-gray-400 w-full py-2 pl-3"
						>
							<option className="text-slate-900" value="">
								Tất cả tiền tệ
							</option>
							<option className="text-slate-900" value="usdt">
								USDT
							</option>
							<option className="text-slate-900" value="btc">
								BTC
							</option>
							<option className="text-slate-900" value="eth">
								ETH
							</option>
							<option className="text-slate-900" value="bnb">
								BNB
							</option>
							<option className="text-slate-900" value="ada">
								ADA
							</option>
						</select>
						<select
							name="pay"
							id="pay"
							className="bg-none border rounded-md border-gray-400 text-gray-400 w-full py-2 pl-3"
						>
							<option className="text-slate-900" value="">
								Tất cả các khoản thanh toán
							</option>
							<option className="text-slate-900" value="paypal">
								Paypal
							</option>
							<option className="text-slate-900" value="visa">
								Visa
							</option>
							<option
								className="text-slate-900"
								value="mastercard"
							>
								Mastercard
							</option>
						</select>
						<select
							name="area"
							id="area"
							className="bg-none border rounded-md border-gray-400 text-gray-400 w-full py-2 pl-3"
						>
							<option className="text-slate-900" value="">
								Tất cả khu vực
							</option>
							<option className="text-slate-900" value="vn">
								Việt Nam
							</option>
							<option className="text-slate-900" value="us">
								Mỹ
							</option>
							<option className="text-slate-900" value="eu">
								Châu Âu
							</option>
							<option className="text-slate-900" value="jp">
								Nhật Bản
							</option>
						</select>
					</div>
				</div>
			</section>
			<section
				id="search-coin"
				className="lg:px-0 mt-10 lg:max-w-4xl xl:max-w-6xl mx-auto md:px-8 p-4"
			>
				<div className="">
					<h2 className="font-bold text-2xl text-white">
						Tiền điện tử
					</h2>
					<p className="text-gray-400 text-sm">
						Khám phá tiền điện tử có sẵn trên Vinance
					</p>
					<input
						type="search"
						placeholder="Tìm kiếm ở đây..."
						className="bg-none border rounded-md border-gray-400 text-white w-full py-2 pl-3 mt-2 md:max-w-xs"
					/>
				</div>
				<div className="mt-8 lg:mt-4 md:flex items-start gap-4">
					<div className="top-coin bg-slate-900 rounded-xl p-4 flex-1 h-full">
						<h3 className="text-gray-300 mb-2">
							Trao đổi hàng đầu
						</h3>
						<table className="w-full text-white border-separate border-spacing-y-4">
							<tbody>
								{topCoins.map((coin) => (
									<tr key={coin.key}>
										<td className="text-left flex items-center gap-2">
											<Cryptocon
												icon={coin.icon}
												badgeRadius={999}
												size={24}
											/>
											{coin.code}
										</td>
										<td
											className={`text-center ${
												coin.change.includes("+")
													? "text-green-500"
													: "text-red-500"
											}`}
										>
											{coin.price}
										</td>
										<td
											className={`text-right ${
												coin.change.includes("+")
													? "text-green-500"
													: "text-red-500"
											}`}
										>
											{coin.change}
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
								{topCoins.map((coin) => (
									<tr key={coin.key}>
										<td className="text-left flex items-center gap-2">
											<Cryptocon
												icon={coin.icon}
												badgeRadius={999}
												size={24}
											/>
											{coin.code}
										</td>
										<td
											className={`text-center ${
												coin.change.includes("+")
													? "text-green-500"
													: "text-red-500"
											}`}
										>
											{coin.price}
										</td>
										<td
											className={`text-right ${
												coin.change.includes("+")
													? "text-green-500"
													: "text-red-500"
											}`}
										>
											{coin.change}
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
