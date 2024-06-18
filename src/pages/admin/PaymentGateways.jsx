import React, { useState, useEffect } from "react";
import { Table, Button, Form, Input, Switch, message, Popconfirm } from "antd";
import axios from "axios";

const PaymentGateways = () => {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Function to fetch bank list from the server
  const fetchBanks = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://api.trademarkk.com.vn/api/admin/bank'); // Assuming you have an endpoint to get the bank list
      const bankData = response.data.map(bank => ({
        ...bank,
        key: bank._id,
        isActive: bank.isActive // Assuming the default value for isActive
      }));
      setBanks(bankData);
    } catch (error) {
      console.error(error);
      message.error("An error occurred while fetching the bank list.");
    }
    setLoading(false);
  };

  // Fetch banks on component mount
  useEffect(() => {
    fetchBanks();
  }, []);

  const columns = [
    { title: "Bank Name", dataIndex: "name", key: "name" },
    { title: "Bank Account", dataIndex: "account", key: "account" },
    { title: "User Full Name", dataIndex: "user", key: "user" },
    {
      title: "Active",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive, record) => (
        <Switch
          checked={isActive}
          onChange={() => handleToggleActive(record.key, isActive)}
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Popconfirm
          title="Are you sure to delete this bank account?"
          onConfirm={() => removeBank(record.key)}
          okText="Yes"
          cancelText="No"
        >
          <Button danger>
            Remove
          </Button>
        </Popconfirm>
      ),
    },
  ];

  const handleToggleActive = async (id, isActive) => {
    try {
      const updatedBanks = banks.map((bank) => {
        if (bank.key === id) {
          return { ...bank, isActive: !isActive };
        }
        return bank;
      });
      setBanks(updatedBanks);
      await axios.put(`https://api.trademarkk.com.vn/api/admin/bank/update/${id}`, { isActive: !isActive });
      message.success("Cập nhật cổng thanh toán thành công.");
    } catch (error) {
      console.error(error);
      message.error("An error occurred while updating bank account.");
    }
  };

  const addBank = async (values) => {
    setFormLoading(true);
    try {
      const response = await axios.post('https://api.trademarkk.com.vn/api/admin/bank/create', values);
      if (response.data.success) {
        message.success(response.data.message);
        // Fetch the updated bank list
        fetchBanks();
      } else {
        message.error("Failed to create bank account.");
      }
    } catch (error) {
      console.error(error);
      message.error("An error occurred while creating the bank account.");
    }
    setFormLoading(false);
  };

  const removeBank = async (bankId) => {
    try {
      const response = await axios.post(`https://api.trademarkk.com.vn/api/admin/bank/delete/${bankId}`);
      if (response.data.success) {
        message.success(response.data.message);
        // Fetch the updated bank list
        fetchBanks();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      message.error("An error occurred while removing the bank account.");
    }
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
          <Button type="primary" htmlType="submit" loading={formLoading}>
            Add Bank
          </Button>
        </Form.Item>
      </Form>
      <Table dataSource={banks} columns={columns} loading={loading} />
    </div>
  );
};

export default PaymentGateways;
