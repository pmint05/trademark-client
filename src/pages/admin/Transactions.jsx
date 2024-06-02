import React, { useEffect, useState } from "react";
import { Table, Tag, DatePicker, Button } from "antd";
import moment from "moment";
import Search from "antd/es/input/Search";

const { RangePicker } = DatePicker;

function Transactions() {
	const coins = ["BTC", "ETH", "USD", "EUR", "JPY", "CNY", "KRW", "INR"];

	const columns = [
		{
			title: "ID",
			dataIndex: "id",
			key: "id",
		},
		{
			title: "Username",
			dataIndex: "username",
			key: "username",
			sorter: (a, b) => a.username.localeCompare(b.username),
		},
		{
			title: "Coin",
			dataIndex: "coin",
			key: "coin",
			onFilter: (value, record) => record.coin.indexOf(value) === 0,
			filters: coins.map((coin) => ({ text: coin, value: coin })),
			filterMode: "tree",
		},
		{
			title: "Amount",
			dataIndex: "amount",
			key: "amount",
			sorter: (a, b) => a.amount - b.amount,
			sortDirections: ["descend", "ascend"],
		},
		{
			title: "Type",
			dataIndex: "transactionType",
			key: "transactionType",
			filters: [
				{ text: "Debit", value: "debit" },
				{ text: "Credit", value: "credit" },
			],
			onFilter: (value, record) =>
				record.transactionType.indexOf(value) === 0,
			render: (transactionType) => (
				<Tag color={transactionType === "debit" ? "red" : "green"}>
					{transactionType.toUpperCase()}
				</Tag>
			),
			width: 70,
		},
		{
			title: "Time of Transaction",
			dataIndex: "transactionTime",
			key: "transactionTime",
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
				const transactionDate = new Date(record.transactionTime);
				return (
					transactionDate >= startDate && transactionDate <= endDate
				);
			},
			sorter: (a, b) =>
				new Date(a.transactionTime) - new Date(b.transactionTime),
			render: (transactionTime) => (
				<span>
					{moment
						.utc(transactionTime)
						.utcOffset(7)
						.format("DD/MM/YYYY HH:mm:ss")}
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
		setData(
			Array.from({ length: 100 }, (_, i) => ({
				key: i + 1,
				id: new Date().getTime() + i,
				username: `userabcxyz${i}`,
				coin: coins[(Math.random() * coins.length) | 0],
				amount: (Math.random() * 10).toFixed(2),
				transactionType: i % 2 === 0 ? "debit" : "credit",
				transactionTime: moment().subtract(i, "days").toISOString(),
			}))
		);
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
