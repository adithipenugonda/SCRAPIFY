import React from "react";

import Button from "../common/Button";

import "./UserTable.css";


const UserTable = ({
  users = [],
}) => {

  return (
    <div className="user-table-card">

      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <div className="user-table-header">

        <h2>
          Users Management 👥
        </h2>

        <p>
          Monitor and manage all
          registered users.
        </p>

      </div>


      {/* ================================= */}
      {/* TABLE */}
      {/* ================================= */}

      <div className="user-table">

        {/* TABLE HEAD */}
        <div className="user-row user-head">

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
        {users.length > 0 ? (

          users.map((user) => (

            <div
              key={user.id}
              className="user-row"
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

          ))

        ) : (

          <div className="empty-users">

            <h3>
              No Users Found
            </h3>

            <p>
              Registered users will
              appear here.
            </p>

          </div>

        )}

      </div>

    </div>
  );
};

export default UserTable;