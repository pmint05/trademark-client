import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, Table } from "antd";
import axios from "axios";

const { Option } = Select;

function Currencies() {
	const [coins, setCoins] = useState([]);
	const [topCoins, setTopCoins] = useState([]);
	const [hotCoins, setHotCoins] = useState([]);
	// const columns = [
	// 	{
	// 		title: "Rank.",
	// 		dataIndex: "market_cap_rank",
	// 		key: "market_cap_rank",
	// 	},
	// 	{
	// 		title: "Coin Image",
	// 		dataIndex: "image",
	// 		key: "image",
	// 		render: (image) => (
	// 			<img src={image} alt="coin" style={{ width: "30px" }} />
	// 		),
	// 	},
	// 	{
	// 		title: "Coin Name",
	// 		dataIndex: "name",
	// 		key: "name",
	// 	},
	// 	{
	// 		title: "Coin Code",
	// 		dataIndex: "symbol",
	// 		key: "symbol",
	// 		render: (symbol) => <strong>{symbol.toUpperCase()}</strong>,
	// 	},
	// 	{
	// 		title: "Current Price",
	// 		dataIndex: "current_price",
	// 		key: "current_price",
	// 		render: (current_price) => (
	// 			<span>{current_price.toLocaleString()} VND</span>
	// 		),
	// 	},
	// 	{
	// 		title: "Change (24h)",
	// 		dataIndex: "price_change_percentage_24h",
	// 		key: "price_change_percentage_24h",
	// 		render: (price_change_percentage_24h) => (
	// 			<span
	// 				style={{
	// 					color:
	// 						price_change_percentage_24h > 0 ? "green" : "red",
	// 				}}
	// 			>
	// 				{price_change_percentage_24h.toFixed(2)}%
	// 			</span>
	// 		),
	// 	},
	// 	{
	// 		title: "Action",
	// 		key: "action",
	// 		render: (_, record) => (
	// 			<div>
	// 				<Button type="primary" onClick={() => handleEdit(record)}>
	// 					Edit
	// 				</Button>
	// 				<Button type="danger" onClick={() => handleDelete(record)}>
	// 					Delete
	// 				</Button>
	// 			</div>
	// 		),
	// 	},
	// ];

	// Define the handleEdit and handleDelete functions
	const handleEdit = (record) => {
		console.log("Edit record:", record);
		// Handle edit...
	};

	const handleDelete = (record) => {
		console.log("Delete record:", record);
		// Handle delete...
	};
	useEffect(() => {
		axios
			.get(
				"https://api.coingecko.com/api/v3/coins/markets?vs_currency=vnd"
			)
			.then((response) => {
				setCoins(response.data);
				setTopCoins(
					response.data.slice(Math.random() * 5, Math.random() * 5)
				);
				setHotCoins(
					response.data.slice(0, Math.floor(Math.random() * 5))
				);
			})
			.catch((error) => {
				console.error("Error fetching coins", error);
			});
	}, []);

	const handleFormSubmit = (values) => {
		console.log("Form values:", values);
		// Handle form submission...
	};
	// const rowSelection = {
	// 	onChange: (selectedRowKeys, selectedRows) => {
	// 		console.log(
	// 			`Selected row keys: ${selectedRowKeys}`,
	// 			"Selected rows: ",
	// 			selectedRows
	// 		);
	// 	},
	// };
	return (
		<div className="container mx-auto p-4 bg-white lg:p-6 rounded-lg flex gap-6 flex-wrap">
			{/* Realtime Info Coins Form */}
			<Form
				onFinish={handleFormSubmit}
				className="min-w-full md:min-w-72"
			>
				<Form.Item name="realtimeCoins" label="Coin">
					<Select
						mode="multiple"
						placeholder="Enter coin name"
						showSearch
						optionFilterProp="children"
						filterOption={(input, option) =>
							option.children
								.toLowerCase()
								.indexOf(input.toLowerCase()) >= 0
						}
					>
						{coins.map((coin) => (
							<Option key={coin.id} value={coin.symbol}>
								{coin.name}
							</Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item>
					<Button type="primary" htmlType="submit">
						Set Coin
					</Button>
				</Form.Item>
			</Form>

			{/* Top Coins */}
			<Form
				onFinish={handleFormSubmit}
				className="min-w-full md:min-w-72"
			>
				<Form.Item name="topCoins" label="Top Coins">
					<Select
						mode="multiple"
						placeholder="Enter coin name"
						showSearch
						optionFilterProp="children"
						filterOption={(input, option) =>
							option.children
								.toLowerCase()
								.indexOf(input.toLowerCase()) >= 0
						}
					>
						{coins.map((coin) => (
							<Option key={coin.id} value={coin.symbol}>
								{coin.name}
							</Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item>
					<Button type="primary" htmlType="submit">
						Set Top Coins
					</Button>
				</Form.Item>
			</Form>
			{/* Hot Coins */}
			<Form
				onFinish={handleFormSubmit}
				className="min-w-full md:min-w-72"
			>
				<Form.Item name="hotCoins" label="Hot Coins">
					<Select
						mode="multiple"
						placeholder="Enter coin name"
						showSearch
						optionFilterProp="children"
						filterOption={(input, option) =>
							option.children
								.toLowerCase()
								.indexOf(input.toLowerCase()) >= 0
						}
					>
						{coins.map((coin) => (
							<Option key={coin.id} value={coin.symbol}>
								{coin.name}
							</Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item>
					<Button type="primary" htmlType="submit">
						Set Hot Coins
					</Button>
				</Form.Item>
			</Form>

			{/* <Table
					rowSelection={rowSelection}
					columns={columns}
					dataSource={hotCoins}
					rowKey="id"
					bordered
				/> */}
		</div>
	);
}

export default Currencies;
