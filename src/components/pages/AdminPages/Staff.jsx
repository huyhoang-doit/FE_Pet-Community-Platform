import { useState } from "react";

const Staff = () => {
  const [staffMembers, setStaffMembers] = useState([
    { id: 1, name: "Staff Member 1", role: "Admin", status: "active" },
    { id: 2, name: "Staff Member 2", role: "Editor", status: "active" },
    { id: 3, name: "Staff Member 3", role: "Viewer", status: "offline" },
  ]);

  const handleBan = (id) => {
    // Implement ban logic (e.g., change status to 'banned')
    setStaffMembers(
      staffMembers.map((staff) =>
        staff.id === id ? { ...staff, status: "banned" } : staff
      )
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Staff Management</h1>
      <table className="table-auto min-w-full mt-4">
        <thead>
          <tr>
            <th className="border px-4 py-2 w-0.5">ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Role</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {staffMembers.map((staff) => (
            <tr key={staff.id}>
              <td className="text-center border px-4 py-2">{staff.id}</td>
              <td className="border px-4 py-2">{staff.name}</td>
              <td className="border px-4 py-2">{staff.role}</td>
              <td className="border px-4 py-2">{staff.status}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleBan(staff.id)}
                  className="text-red-500"
                >
                  Ban
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Staff;
