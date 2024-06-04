import React, { useState } from "react";
import { Table, Button, Form, Input, Switch } from "antd";

function PaymentGateways() {
	const [banks, setBanks] = useState([
		{
			id: "1",
			key: "1",
			name: "Bank1",
			account: "123456",
			user: "John Doe",
			isActive: true,
		},
		{
			id: "2",
			key: "2",
			name: "Bank2",
			account: "654321",
			user: "Jane Doe",
			isActive: false,
		},
	]);

	const columns = [
		{ title: "Bank Name", dataIndex: "name", key: "name" },
		{ title: "Bank Account", dataIndex: "account", key: "account" },
		{ title: "User Full Name", dataIndex: "user", key: "user" },
		{
			title: "Active",
			dataIndex: "isActive",
			key: "isActive",
			render: (isActive, { id }) => (
				<Switch
					checked={isActive}
					onChange={() => handleToggleActive(id)}
				/>
			),
		},
		{
			title: "Action",
			key: "action",
			render: (text, record) => (
				<Button onClick={() => removeBank(record.key)} danger>
					Remove
				</Button>
			),
		},
	];
	const handleToggleActive = (id) => {
		const updatedBanks = banks.map((bank) => {
			if (bank.id == id) {
				return { ...bank, isActive: !bank.isActive };
			}
			return bank;
		});
		setBanks(updatedBanks);
	};

	const addBank = (values) => {
		setBanks([
			...banks,
			{ key: banks.length + 1, ...values, isActive: true },
		]);
	};

	const removeBank = (key) => {
		setBanks(banks.filter((bank) => bank.key !== key));
	};

	return (
		<div className="p-4 lg:p-8 bg-white rounded-lg">
			<h1 className="font-bold text-2xl mb-6">Payment Gateways</h1>
			<Form onFinish={addBank}>
				<Form.Item
					name="name"
					rules={[
						{ required: true, message: "Please input bank name!" },
					]}
				>
					<Input placeholder="Bank Name" />
				</Form.Item>
				<Form.Item
					name="account"
					rules={[
						{
							required: true,
							message: "Please input bank account!",
						},
					]}
				>
					<Input placeholder="Bank Account" />
				</Form.Item>
				<Form.Item
					name="user"
					rules={[
						{
							required: true,
							message: "Please input user full name!",
						},
					]}
				>
					<Input placeholder="User Full Name" />
				</Form.Item>
				<Form.Item>
					<Button type="primary" htmlType="submit">
						Add Bank
					</Button>
				</Form.Item>
			</Form>
			<Table dataSource={banks} columns={columns} />
		</div>
	);
}

export default PaymentGateways;
