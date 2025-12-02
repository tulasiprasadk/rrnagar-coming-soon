// Save as src/admin/Users.jsx

import React from "react";

export default function Users() {
  // Placeholder static list. Replace with API fetch.
  const users = [
    { id: 1, name: "Suresh", email: "suresh@example.com" },
    { id: 2, name: "Meena", email: "meena@example.com" },
  ];

  return (
    <section>
      <h1>Users</h1>
      <table className="admin-table">
        <thead>
          <tr><th>ID</th><th>Name</th><th>Email</th></tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}