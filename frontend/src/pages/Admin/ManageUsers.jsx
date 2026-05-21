import React from "react";

import AdminLayout from "../../layouts/AdminLayout";

import Button from "../../components/common/Button";

import "./ManageUsers.css";


const ManageUsers = () => {

  // ==========================================
  // DUMMY USERS DATA
  // ==========================================
  const users = [
    {
      id: 1,
      name: "Adithi",
      email: "adithi@gmail.com",
      pickups: 24,
      points: 1240,
      status: "Active",
    },

    {
      id: 2,
      name: "Rahul Kumar",
      email: "rahul@gmail.com",
      pickups: 18,
      points: 940,
      status: "Blocked",
    },

    {
      id: 3,
      name: "Sneha Reddy",
      email: "sneha@gmail.com",
      pickups: 32,
      points: 1820,
      status: "Active",
    },

    {
      id: 4,
      name: "Kiran Sharma",
      email: "kiran@gmail.com",
      pickups: 12,
      points: 620,
      status: "Active",
    },
  ];


  return (
    <AdminLayout>

      <div className="manage-users-page">

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div className="manage-users-header">

          <h1>
            Manage Users 👥
          </h1>

          <p>
            View, manage, and monitor
            registered platform users.
          </p>

        </div>


        {/* ================================= */}
        {/* TABLE */}
        {/* ================================= */}

        <div className="users-table-card">

          <div className="users-table-header">

            <h2>
              Registered Users
            </h2>

          </div>


          <div className="users-table">

            {/* TABLE HEAD */}
            <div className="users-row users-head">

              <span>
                Name
              </span>

              <span>
                Email
              </span>

              <span>
                Pickups
              </span>

              <span>
                Points
              </span>

              <span>
                Status
              </span>

              <span>
                Actions
              </span>

            </div>


            {/* TABLE BODY */}
            {users.map((user) => (

              <div
                key={user.id}
                className="users-row"
              >

                <span>
                  {user.name}
                </span>

                <span>
                  {user.email}
                </span>

                <span>
                  {user.pickups}
                </span>

                <span>
                  {user.points}
                </span>

                <span
                  className={
                    user.status === "Active"
                      ? "active-status"
                      : "blocked-status"
                  }
                >
                  {user.status}
                </span>


                {/* ACTIONS */}
                <div className="user-actions">

                  <Button
                    text="Edit"
                    variant="secondary"
                  />

                  <Button
                    text="Delete"
                    variant="danger"
                  />

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </AdminLayout>
  );
};

export default ManageUsers;