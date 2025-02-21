import { useEffect, useState } from "react";
import { Card, Table } from "antd";
import { Line } from "react-chartjs-2";
import { getStatsAPI } from "@/apis/admin";
import { getTop5DonateAPI } from "@/apis/donate";
import { formatVND } from "@/utils/formatVND";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { toast } from "sonner";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [months, setMonths] = useState([]);
  const [totalDonations, setTotalDonations] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentMonthTotal, setCurrentMonthTotal] = useState(0);
  const [top5, setTop5] = useState([]);

  const currentMonthName = new Date().toLocaleString("en-US", {
    month: "long",
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await getStatsAPI();
        setTotalUsers(data?.data?.user || 0);

        const donationsData = data?.data?.donations || [];
        const donationsMap = new Map(
          donationsData.map((item) => [item.month, item.total])
        );

        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];

        const orderedDonations = monthNames.map(
          (month) => donationsMap.get(month) || 0
        );
        setMonths(monthNames);
        setTotalDonations(orderedDonations);
        setCurrentMonthTotal(donationsMap.get(currentMonthName) || 0);
      } catch (error) {
        toast.error("Error fetching stats:", error);
      }
    };

    const fetchTopDonators = async () => {
      try {
        const { data } = await getTop5DonateAPI();
        setTop5(data?.data || []);
      } catch (error) {
        toast.error("Error fetching top 5 donors:", error);
      }
    };

    fetchStats();
    fetchTopDonators();
  }, [currentMonthName]);

  const donationsData = {
    labels: months,
    datasets: [
      {
        label: "Monthly Donations",
        data: totalDonations,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
        pointBorderColor: "#fff",
        pointRadius: 5,
        tension: 0.4,
      },
    ],
  };

  const columns = [
    { title: "User", dataIndex: ["user", "username"], key: "username" },
    {
      title: "Donation Amount (VNĐ)",
      dataIndex: "totalAmount",
      key: "amount",
      render: formatVND,
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4">
        <Card title="Total Users" bordered={false} className="text-center">
          <p className="text-2xl font-bold">{totalUsers}</p>
        </Card>
        <Card
          title={`Total Donations in ${currentMonthName}`}
          bordered={false}
          className="text-center"
        >
          <p className="text-2xl font-bold">{formatVND(currentMonthTotal)}</p>
        </Card>
      </div>

      <Card title="Monthly Donations" className="mt-4">
        <Line data={donationsData} />
      </Card>

      <Card title="Top 5 Donors" className="mt-4">
        <Table
          dataSource={top5}
          columns={columns}
          pagination={false}
          rowKey={(record) => record.user._id}
        />
      </Card>
    </div>
  );
};

export default Dashboard;
