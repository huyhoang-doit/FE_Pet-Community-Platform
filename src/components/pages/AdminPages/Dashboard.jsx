import { getStatsAPI } from "@/apis/admin";
import { Card, Table } from "antd";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
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
  const [topDonors, setTopDonors] = useState([]);

  // Get current month name (e.g., "January")
  const currentMonthName = new Date().toLocaleString("en-US", {
    month: "long",
  });

  useEffect(() => {
    const getStats = async () => {
      try {
        const response = await getStatsAPI();
        console.log("API Response:", response.data?.data);

        setTotalUsers(response.data?.data?.user || 0);

        const donationsData = response.data?.data?.donations || [];
        const donorsData = response.data?.data?.topDonors || []; // Ensure this is in API response

        // Convert array into a Map for easier access
        const donationsMap = new Map(
          donationsData.map((item) => [item.month, item.total])
        );

        // Ensure all months exist (default 0 if missing)
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
        const orderedDonations = monthNames.map((month) => ({
          month,
          total: donationsMap.get(month) || 0,
        }));

        setMonths(orderedDonations.map((item) => item.month));
        setTotalDonations(orderedDonations.map((item) => item.total));

        // Get total donations for the current month
        setCurrentMonthTotal(donationsMap.get(currentMonthName) || 0);

        // Process top 5 donors
        const sortedTopDonors = donorsData
          .sort((a, b) => b.total - a.total) // Sort descending by total donation
          .slice(0, 5) // Get only top 5
          .map((donor, index) => ({
            key: index + 1,
            name: donor.name,
            amount: donor.total,
          }));

        setTopDonors(sortedTopDonors);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    getStats();
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
        tension: 0.4, // Độ cong của đường, 0 là đường thẳng
      },
    ],
  };

  const columns = [
    { title: "User", dataIndex: "name", key: "name" },
    { title: "Donation Amount (VNĐ)", dataIndex: "amount", key: "amount" },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* Total Users & Donations */}
      <div className="grid grid-cols-2 gap-4">
        <Card title="Total Users" bordered={false} className="text-center">
          <p className="text-2xl font-bold">{totalUsers}</p>
        </Card>
        <Card
          title={`Total Donations in ${currentMonthName}`}
          bordered={false}
          className="text-center"
        >
          <p className="text-2xl font-bold">
            {currentMonthTotal.toLocaleString()} VNĐ
          </p>
        </Card>
      </div>

      {/* Donations Chart */}
      <Card title="Monthly Donations" className="mt-4">
        <Line data={donationsData} />
      </Card>

      {/* Top 5 Donors */}
      <Card title="Top 5 Donors" className="mt-4">
        <Table dataSource={topDonors} columns={columns} pagination={false} />
      </Card>
    </div>
  );
};

export default Dashboard;
