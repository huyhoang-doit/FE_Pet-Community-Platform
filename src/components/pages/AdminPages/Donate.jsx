import * as XLSX from "xlsx";
import { Table, Button, Tag } from "antd";
import { FileExcelOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import Search from "antd/es/input/Search";
import { getAllDonationsAPI } from "@/apis/admin";
import { formatVND } from "@/utils/formatVND";

const Donate = () => {
  const [donations, setDonations] = useState([]);
  const [limit] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
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
      title: "User",
      dataIndex: "user",
      key: "user",
      render: (user) => user?.username,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      sorter: (a, b) => a.amount - b.amount,
      render: (amount) => `${formatVND(amount)}`,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "date",
      render: (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        const hour = String(d.getHours()).padStart(2, "0");
        const minute = String(d.getMinutes()).padStart(2, "0");
        return `${day}-${month}-${year} ${hour}:${minute} GMT+7`;
      },
    },
    {
      title: (
        <div className="flex items-center gap-10">
          Campain
          <Search
            placeholder="Search users..."
            onSearch={(value) => getAllDonations(1, value)}
            style={{ width: 200 }}
            allowClear
          />
        </div>
      ),
      dataIndex: "campaign",
      key: "campaign",
      render: (campaign) => campaign?.title,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={
            status === "completed" ? "green" : status === "cancelled" && "red"
          }
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      width: 400,
    },
  ];

  const getAllDonations = async (page = 1, search = "") => {
    try {
      const response = await getAllDonationsAPI(
        page,
        search ? 1000 : limit,
        search
      );
      if (response.data?.data) {
        setTotalResults(
          search ? response.data.data.length : response.data.data.totalResults
        );
      }

      const donationsData = Array.isArray(response.data?.data)
        ? response.data.data
        : [];
      setDonations(donationsData);
    } catch (error) {
      console.error("Error fetching donations:", error);
    }
  };
  useEffect(() => {
    getAllDonations(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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
      <Table
        columns={columns}
        dataSource={donations}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize: limit,
          total: totalResults,
          onChange: handlePageChange,
        }}
      />
    </div>
  );
};

export default Donate;
