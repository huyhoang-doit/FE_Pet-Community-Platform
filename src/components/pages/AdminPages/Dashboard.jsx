import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Card, Table } from "antd";

// Đăng ký ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const totalUsers = 100; // Replace with actual data
  const totalDonations = 5000; // Replace with actual data

  const donationsData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Monthly Donations",
        data: [1200, 1900, 3000, 500, 2000, 3000], // Replace with actual data
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const topUsers = [
    { key: "1", name: "User 1", amount: 1000 },
    { key: "2", name: "User 2", amount: 800 },
    { key: "3", name: "User 3", amount: 600 },
    { key: "4", name: "User 4", amount: 400 },
    { key: "5", name: "User 5", amount: 200 },
  ]; // Replace with actual data

  const columns = [
    { title: "User", dataIndex: "name", key: "name" },
    { title: "Donation Amount ($)", dataIndex: "amount", key: "amount" },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* Tổng Users & Donations */}
      <div className="grid grid-cols-2 gap-4">
        <Card title="Total Users" bordered={false} className="text-center">
          <p className="text-2xl font-bold">{totalUsers}</p>
        </Card>
        <Card title="Total Donations" bordered={false} className="text-center">
          <p className="text-2xl font-bold">${totalDonations}</p>
        </Card>
      </div>

      {/* Biểu đồ Donations */}
      <Card title="Monthly Donations" className="mt-4">
        <Bar data={donationsData} />
      </Card>

      {/* Top 5 Donors */}
      <Card title="Top 5 Donors" className="mt-4">
        <Table dataSource={topUsers} columns={columns} pagination={false} />
      </Card>
    </div>
  );
};

export default Dashboard;
