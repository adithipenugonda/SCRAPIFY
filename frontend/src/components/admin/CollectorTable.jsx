import React from "react";

import Button from "../common/Button";

import "./CollectorTable.css";


const CollectorTable = ({
  collectors = [],
}) => {

  return (
    <div className="collector-table-card">

      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <div className="collector-table-header">

        <h2>
          Collectors Management 🚚
        </h2>

        <p>
          Manage collectors, monitor
          performance, and track
          earnings.
        </p>

      </div>


      {/* ================================= */}
      {/* TABLE */}
      {/* ================================= */}

      <div className="collector-table">

        {/* TABLE HEAD */}
        <div className="collector-row collector-head">

          <span>
            Name
          </span>

          <span>
            Email
          </span>

          <span>
            Jobs
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
        {collectors.length > 0 ? (

          collectors.map((collector) => (

            <div
              key={collector.id}
              className="collector-row"
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

          ))

        ) : (

          <div className="empty-collectors">

            <h3>
              No Collectors Found
            </h3>

            <p>
              Registered collectors
              will appear here.
            </p>

          </div>

        )}

      </div>

    </div>
  );
};

export default CollectorTable;