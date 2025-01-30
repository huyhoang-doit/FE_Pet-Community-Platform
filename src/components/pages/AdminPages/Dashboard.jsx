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

// Register the required components
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
    { name: "User  1", amount: 1000 },
    { name: "User  2", amount: 800 },
    { name: "User  3", amount: 600 },
    { name: "User  4", amount: 400 },
    { name: "User  5", amount: 200 },
  ]; // Replace with actual data

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl">Total Users</h2>
          <p className="text-2xl">{totalUsers}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl">Total Donations</h2>
          <p className="text-2xl">${totalDonations}</p>
        </div>
      </div>
      <div className="mt-4 w-full h-auto">
        <Bar data={donationsData} />
      </div>
      <div className="mt-4">
        <h2 className="text-xl">Top 5 Donors</h2>
        <ul className="list-disc pl-5">
          {topUsers.map((user, index) => (
            <li key={index}>
              {user.name}: ${user.amount}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
