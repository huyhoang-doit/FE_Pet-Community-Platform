import * as XLSX from "xlsx";
import { Table, Button } from "antd";
import { FileExcelOutlined } from "@ant-design/icons";

const Donate = () => {
  const donations = [
    { id: 1, user: "User 1", amount: 1000, date: "2023-01-01" },
    { id: 2, user: "User 2", amount: 800, date: "2023-01-02" },
    { id: 3, user: "User 3", amount: 1200, date: "2023-02-10" },
    { id: 4, user: "User 4", amount: 500, date: "2023-03-15" },
  ];

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(donations);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Donations");
    XLSX.writeFile(
      wb,
      `donations-${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      filters: [
        { text: "User 1", value: "User 1" },
        { text: "User 2", value: "User 2" },
      ],
      onFilter: (value, record) => record.user.includes(value),
    },
    {
      title: "Amount ($)",
      dataIndex: "amount",
      key: "amount",
      sorter: (a, b) => a.amount - b.amount,
      render: (amount) => `$${amount.toLocaleString()}`,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Donation Management</h1>
      <Button
        type="primary"
        icon={<FileExcelOutlined />}
        onClick={exportToExcel}
        className="mb-4"
      >
        Export to Excel
      </Button>
      <Table columns={columns} dataSource={donations} rowKey="id" />
    </div>
  );
};

export default Donate;
