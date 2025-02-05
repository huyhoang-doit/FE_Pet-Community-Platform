import * as XLSX from "xlsx";

const Donate = () => {
  const donations = [
    { id: 1, user: "User  1", amount: 1000, date: "2023-01-01" },
    { id: 2, user: "User  2", amount: 800, date: "2023-01-02" },
    // Add more donations
  ];

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(donations);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Donations");
    XLSX.writeFile(wb, "donations.xlsx");
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Donation Management</h1>
      <button
        onClick={exportToExcel}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
      >
        Export to Excel
      </button>
      <table className="min-w-full mt-4">
        <thead>
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">User </th>
            <th className="border px-4 py-2">Amount</th>
            <th className="border px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {donations.map((donation) => (
            <tr key={donation.id}>
              <td className="border px-4 py-2">{donation.id}</td>
              <td className="border px-4 py-2">{donation.user}</td>
              <td className="border px-4 py-2">${donation.amount}</td>
              <td className="border px-4 py-2">{donation.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Donate;
