import { useState } from "react";
import { Search, Plus, Users, X, UserRound } from "lucide-react";
import "./Users.css";

function UsersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);

  const [users, setUsers] = useState([
    { id: 1, name: "John Mathew", email: "john@gmail.com", role: "customer" },
    { id: 2, name: "Sarah Thomas", email: "sarah@gmail.com", role: "staff" },
    { id: 3, name: "Alex Joseph", email: "alex@gmail.com", role: "customer" },
    { id: 4, name: "Admin User", email: "admin@brightloop.com", role: "admin" },
  ]);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "customer",
  });

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());

    const matchesFilter = filter === "All" || user.role === filter;

    return matchesSearch && matchesFilter;
  });

  const handleAddUser = (e) => {
    e.preventDefault();

    const user = {
      id: Date.now(),
      ...newUser,
    };

    setUsers([...users, user]);
    setNewUser({ name: "", email: "", role: "customer" });
    setShowForm(false);
  };

  return (
    <div className="users-page">
      <div className="users-heading">
        <div>
          <h1>Users Management</h1>
          <p>Manage administrators, staff members and customers.</p>
        </div>

        <button className="add-user-button" onClick={() => setShowForm(true)}>
          <Plus size={18} /> Add User
        </button>
      </div>

      <div className="users-summary">
        <div className="users-summary-icon">
          <Users size={25} />
        </div>
        <div>
          <p>Total Users</p>
          <h2>{users.length}</h2>
        </div>
      </div>

      <div className="users-table-container">
        <div className="users-toolbar">
          <div className="users-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="All">All Roles</option>
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
            <option value="customer">Customer</option>
          </select>
        </div>

        <div className="users-table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>USER</th>
                <th>EMAIL</th>
                <th>ROLE</th>
                <th>ID</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="user-name-cell">
                      <div className="user-avatar">
                        <UserRound size={18} />
                      </div>
                      <strong>{user.name}</strong>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>#{user.id}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <p className="no-users">No users found.</p>
          )}
        </div>
      </div>

      {showForm && (
        <div className="user-modal-overlay">
          <div className="user-modal">
            <div className="modal-heading">
              <h2>Add New User</h2>
              <button onClick={() => setShowForm(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddUser}>
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter full name"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
                required
              />

              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter email address"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                required
              />

              <label>User Role</label>
              <select
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value })
                }
              >
                <option value="customer">Customer</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>

              <button type="submit" className="save-user-button">
                Add User
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsersPage;
