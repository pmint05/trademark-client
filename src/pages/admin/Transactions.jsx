import React, { useEffect, useState } from "react";
import { Table, Tag, DatePicker, Button } from "antd";
import moment from "moment";
import Search from "antd/es/input/Search";
import axios from "axios";

const { RangePicker } = DatePicker;

function Transactions() {
	const [coins, setCoins] = useState([]);
	useEffect(() => {
		axios
			.get("https://api.trademarkk.com.vn/api/coins")
			.then((res) => {
				setCoins(res.data.coins);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);
	const columns = [
		{
			title: "ID",
			dataIndex: "_id",
			key: "_id",
		},
		{
			title: "Username",
			dataIndex: "transUsername",
			key: "transUsername",
			sorter: (a, b) => a.transUsername.localeCompare(b.transUsername),
		},
		{
			title: "Coin",
			dataIndex: "transNameCoin",
			key: "transNameCoin",
			onFilter: (value, record) =>
				record.transNameCoin.indexOf(value) === 0,
			filters: coins.map((coin) => ({ text: coin, value: coin })),
			filterMode: "tree",
		},
		{
			title: "Amount",
			dataIndex: "transAmount",
			key: "transAmount",
			sorter: (a, b) => a.transAmount - b.transAmount,
			sortDirections: ["descend", "ascend"],
		},
		{
			title: "Type",
			dataIndex: "transType",
			key: "transType",
			filters: [
				{ text: "Sell", value: "sell" },
				{ text: "Buy", value: "buy" },
			],
			onFilter: (value, record) => record.transType.indexOf(value) === 0,
			render: (transType) => (
				<Tag color={transType === "sell" ? "red" : "green"}>
					{transType.toUpperCase()}
				</Tag>
			),
			width: 70,
		},
		{
			title: "Time of Transaction",
			dataIndex: "transTime",
			key: "transTime",
			filterDropdown: ({
				setSelectedKeys,
				selectedKeys,
				confirm,
				clearFilters,
			}) => (
				<div style={{ padding: 8 }}>
					<RangePicker
						value={selectedKeys[0]}
						onChange={(e) => setSelectedKeys(e ? [e] : [])}
						onPressEnter={() => handleSearch(selectedKeys, confirm)}
						style={{ marginBottom: 8, display: "block" }}
					/>
					<Button
						type="primary"
						onClick={() => handleSearch(selectedKeys, confirm)}
						size="small"
						style={{ width: 90, marginRight: 8 }}
					>
						Search
					</Button>
					<Button
						onClick={() => handleReset(clearFilters, confirm)}
						size="small"
						style={{ width: 90 }}
					>
						Reset
					</Button>
				</div>
			),
			onFilter: (value, record) => {
				const startDate = value[0].startOf("day").toDate();
				const endDate = value[1].endOf("day").toDate();
				const transactionDate = new Date(record.transTime);
				return (
					transactionDate >= startDate && transactionDate <= endDate
				);
			},
			sorter: (a, b) => new Date(a.transTime) - new Date(b.transTime),
			render: (transTime) => (
				<span>
					{moment
						.utc(transTime)
						.utcOffset(7)
						.format("HH:mm:ss DD/MM/YYYY")}
				</span>
			),
		},
	];
	const handleSearch = (selectedKeys, confirm) => {
		confirm();
	};
	const handleReset = (clearFilters, confirm) => {
		clearFilters();
		confirm();
	};
	// Replace with your actual data
	const [data, setData] = useState([]);
	useEffect(() => {
		axios
			.get("https://api.trademarkk.com.vn/api/transactions")
			.then((res) => {
				if (res.data.success) {
					setData(res.data.transactions);
				} else {
					console.log("Error: ", res.data.message);
				}
			});
		// setData(
		// 	Array.from({ length: 100 }, (_, i) => ({
		// 		key: i + 1,
		// 		id: new Date().getTime() + i,
		// 		username: `userabcxyz${i}`,
		// 		coin: coins[(Math.random() * coins.length) | 0],
		// 		amount: (Math.random() * 10).toFixed(2),
		// 		transactionType: i % 2 === 0 ? "debit" : "credit",
		// 		transTime: moment().subtract(i, "days").toISOString(),
		// 	}))
		// );
	}, []);
	const [filteredData, setFilteredData] = useState([]);
	useEffect(() => {
		setFilteredData(data);
	}, [data]);
	return (
		<div>
			<center className="mb-4">
				<h1 className="font-bold text-2xl mb-2">Transactions</h1>
				<Search
					placeholder="Search by username"
					style={{ width: 200 }}
					onSearch={(value) => {
						const d = data.filter((item) =>
							item.username
								.toLowerCase()
								.includes(value.toLowerCase())
						);
						setFilteredData(d);
					}}
					onClear={() => setFilteredData(data)}
					allowClear
				/>
			</center>
			<div></div>
			<Table
				bordered
				columns={columns}
				dataSource={filteredData}
				scroll={{
					x: true,
				}}
			/>
		</div>
	);
}

export default Transactions;
