const User = () => {
  const users = [
    { id: 1, name: "User 1", status: "active" },
    { id: 2, name: "User 2", status: "offline" },
    // Add more users
  ];

  const handleBan = (id) => {
    // Implement ban logic
    console.log(`Banned user with id: ${id}`);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">User Management</h1>
      <table className="min-w-full mt-4">
        <thead>
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border px-4 py-2">{user.id}</td>
              <td className="border px-4 py -2">{user.name}</td>
              <td className="border px-4 py-2">{user.status}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleBan(user.id)}
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

export default User;
