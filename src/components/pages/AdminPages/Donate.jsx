import * as XLSX from "xlsx";
import { Table, Button, Tag, Select } from "antd";
import { FileExcelOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import Search from "antd/es/input/Search";
import { formatVND } from "@/utils/formatVND";
import { getAllDonateAPI } from "@/apis/donate";
import { fetchCampaignsAPI } from "@/apis/campaign";

const Donate = () => {
  const [donations, setDonations] = useState([]);
  const [limit] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [searchDescription, setSearchDescription] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    getCampaignOptions();
  }, []);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(donations);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Donations");
    XLSX.writeFile(
      wb,
      `donations-${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  const getCampaignOptions = async () => {
    try {
      const { data } = await fetchCampaignsAPI(1, "");
      setCampaigns(data.data.results);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      return [];
    }
  };

  const columns = [
    {
      title: "Người dùng",
      dataIndex: "user",
      key: "user",
      render: (user) => user?.username,
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      sorter: (a, b) => a.amount - b.amount,
      render: (amount) => `${formatVND(amount)}`,
    },
    {
      title: "Ngày",
      dataIndex: "createdAt",
      key: "date",
      render: (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        const hour = String(d.getHours()).padStart(2, "0");
        const minute = String(d.getMinutes()).padStart(2, "0");
        return `${day}-${month}-${year} ${hour}:${minute}`;
      },
    },
    {
      title: (
        <div className="flex items-center gap-10">
          Chiến dịch
          <Select
            placeholder="Chọn chiến dịch"
            style={{ width: 200 }}
            options={campaigns?.map((campaign) => ({
              label: campaign.title,
              value: campaign._id,
            }))}
            allowClear
            onChange={(value) => {
              setSelectedCampaign(value);
              getAllDonations(1, "", value);
            }}
          />
        </div>
      ),
      dataIndex: "campaign",
      key: "campaign",
      render: (campaign) => campaign?.title,
    },
    {
      title: "Trạng thái",
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
      title: (
        <div className="flex items-center gap-10">
          Nội dung
          <Search
            placeholder="Tìm kiếm nội dung..."
            onSearch={(value) => {
              setSearchDescription(value);
              getAllDonations(1, value, selectedCampaign);
            }}
            style={{ width: 200 }}
            allowClear
          />
        </div>
      ),
      dataIndex: "description",
      key: "description",
      width: 400,
    },
  ];

  const getAllDonations = async (page = 1, description = "", campaign = "") => {
    try {
      const { data } = await getAllDonateAPI(
        page,
        limit,
        description,
        campaign
      );
      if (data?.data.results) {
        console.log(data.data);
        setTotalResults(data.data.totalResults);
      }

      const donationsData = Array.isArray(data?.data.results)
        ? data.data.results
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
      <h1 className="text-2xl font-bold mb-4">Quản lý quyên góp</h1>
      <Button
        type="primary"
        icon={<FileExcelOutlined />}
        onClick={exportToExcel}
        className="mb-4"
      >
        Xuất ra file Excel
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
