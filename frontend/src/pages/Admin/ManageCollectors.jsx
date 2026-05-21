import React from "react";

import AdminLayout from "../../layouts/AdminLayout";

import Button from "../../components/common/Button";

import "./ManageCollectors.css";


const ManageCollectors = () => {

  // ==========================================
  // DUMMY COLLECTOR DATA
  // ==========================================
  const collectors = [
    {
      id: 1,
      name: "Ravi Kumar",
      email: "ravi@gmail.com",
      completedJobs: 124,
      earnings: "₹58,200",
      status: "Active",
    },

    {
      id: 2,
      name: "Anil Sharma",
      email: "anil@gmail.com",
      completedJobs: 98,
      earnings: "₹44,900",
      status: "Inactive",
    },

    {
      id: 3,
      name: "Suresh Reddy",
      email: "suresh@gmail.com",
      completedJobs: 142,
      earnings: "₹72,400",
      status: "Active",
    },

    {
      id: 4,
      name: "Mahesh Kumar",
      email: "mahesh@gmail.com",
      completedJobs: 88,
      earnings: "₹38,500",
      status: "Active",
    },
  ];


  return (
    <AdminLayout>

      <div className="manage-collectors-page">

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div className="manage-collectors-header">

          <h1>
            Manage Collectors 🚚
          </h1>

          <p>
            Monitor collector activity,
            earnings, and pickup
            performance.
          </p>

        </div>


        {/* ================================= */}
        {/* TABLE CARD */}
        {/* ================================= */}

        <div className="collectors-table-card">

          <div className="collectors-table-header">

            <h2>
              Registered Collectors
            </h2>

          </div>


          <div className="collectors-table">

            {/* TABLE HEAD */}
            <div className="collectors-row collectors-head">

              <span>
                Name
              </span>

              <span>
                Email
              </span>

              <span>
                Jobs Completed
              </span>

              <span>
                Earnings
              </span>

              <span>
                Status
              </span>

              <span>
                Actions
              </span>

            </div>


            {/* TABLE BODY */}
            {collectors.map((collector) => (

              <div
                key={collector.id}
                className="collectors-row"
              >

                <span>
                  {collector.name}
                </span>

                <span>
                  {collector.email}
                </span>

                <span>
                  {collector.completedJobs}
                </span>

                <span>
                  {collector.earnings}
                </span>

                <span
                  className={
                    collector.status === "Active"
                      ? "active-status"
                      : "inactive-status"
                  }
                >
                  {collector.status}
                </span>


                {/* ACTIONS */}
                <div className="collector-actions">

                  <Button
                    text="View"
                    variant="secondary"
                  />

                  <Button
                    text="Remove"
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

export default ManageCollectors;