import { DollarOutlined, UserOutlined } from "@ant-design/icons";
import { Card, Col, Row, Statistic, Table } from "antd";
import { PieChart } from "../../components/Charts";

import React, { useState, useEffect } from "react";
import axios from "axios";
function Dashboard() {
	const [userCount, setUserCount] = useState(0);

	useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("https://api.trademarkk.com.vn/api/users");
        const filteredUsers = response.data.filter(user => user.roles.includes("user"));
        setUserCount(filteredUsers.length);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

	const topUsers = [
		{
			key: 1,
			name: "Nguyễn Văn A",
			email: "nguyenvana@gmail.com",
			coins: [
				{
					coin: "BTC",
					amount: 0.0001,
				},
				{
					coin: "ETH",
					amount: 0.001,
				},
			],
			paidAmountInVND: 1000000,
		},
		{
			key: 2,
			name: "Nguyễn Văn B",
			email: "nguyenvanb@gamil.cim",
			coins: [
				{
					coin: "BTC",
					amount: 0.0002,
				},
				{
					coin: "ETH",
					amount: 0.002,
				},
			],
			paidAmountInVND: 2000000,
		},
	];
	return (
		<div className="">
			<Row
				// gutter={{
				// 	xs: [8, 8],
				// 	sm: [16, 16],
				// 	md: [24, 24],
				// 	lg: [32, 32],
				// }}
				gutter={[16, 16]}
			>
				<Col xs={24} sm={12}>
					<Card className="truncate">
						<Statistic
							title="Người dùng"
							value={userCount}
							prefix={<UserOutlined />}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12}>
					<Card className="truncate">
						<Statistic
							title="Tổng oanh thu"
							value={112893}
							precision={2}
							prefix={<DollarOutlined />}
						/>
					</Card>
				</Col>
			</Row>
			<Row className="mt-4 grid grid-cols-1 md:grid-cols-3">
				<div className="lg:max-w-xs min-h-72">
					<PieChart
						title="Top 5 coin"
						data={{
							labels: ["BTC", "ETH", "USDT", "ADA", "BNB"],
							datasets: [
								{
									label: "Amount",
									data: [300, 50, 100, 200, 150],
									backgroundColor: [
										"rgba(255, 99, 132, 0.2)",
										"rgba(54, 162, 235, 0.2)",
										"rgba(255, 206, 86, 0.2)",
										"rgba(75, 192, 192, 0.2)",
										"rgba(153, 102, 255, 0.2)",
									],
									borderColor: [
										"rgba(255, 99, 132, 1)",
										"rgba(54, 162, 235, 1)",
										"rgba(255, 206, 86, 1)",
										"rgba(75, 192, 192, 1)",
										"rgba(153, 102, 255, 1)",
									],
									borderWidth: 1,
								},
							],
						}}
					></PieChart>
				</div>
				<div className="md:col-span-2">
					<Table
						className="w-full h-full break-keep"
						scroll={{
							x: true,
							y: 300,
						}}
						bordered
						title={() => <h2>Top 5 người dùng nhiều coins nhất</h2>}
						dataSource={topUsers}
						columns={[
							{
								title: "Tên",
								dataIndex: "name",
								key: "name",
							},
							{
								title: "Email",
								dataIndex: "email",
								key: "email",
							},
							{
								title: "Coins",
								dataIndex: "coins",
								key: "coins",
								render: (coins) => {
									return (
										<div>
											{coins.map((coin) => (
												<div key={coin.coin}>
													{coin.coin}: {coin.amount}
												</div>
											))}
										</div>
									);
								},
							},
							{
								title: "Số tiền đã thanh toán",
								dataIndex: "paidAmountInVND",
								key: "paidAmountInVND",
								render: (paidAmountInVND) => {
									return (
										<div>
											{paidAmountInVND.toLocaleString()}{" "}
											VND
										</div>
									);
								},
							},
						]}
						pagination={{
							defaultPageSize: 5,
						}}
					></Table>
				</div>
			</Row>
		</div>
	);
}

export default Dashboard;
