import React, { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import API from "../../services/api";
import "./ManagePickups.css";

const ManagePickups = () => {
  // ==========================================
  // STATES
  // ==========================================
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search & Filter
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPickups, setTotalPickups] = useState(0);
  const limit = 8;

  // Selected Pickup for Modal
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ==========================================
  // FETCH DATA
  // ==========================================
  const fetchPickups = async () => {
    setLoading(true);
    try {
      const response = await API.get("/admin/pickups", {
        params: {
          page,
          limit,
          search,
          status: statusFilter,
        },
      });
      if (response.data && response.data.success) {
        setPickups(response.data.pickups);
        setTotalPages(response.data.totalPages || 1);
        setTotalPickups(response.data.totalPickups || 0);
      }
    } catch (err) {
      console.error("Error fetching pickups:", err);
      setError("Failed to fetch pickup requests from MongoDB.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPickups();
  }, [page, search, statusFilter]);

  // ==========================================
  // SEARCH & FILTER HANDLERS
  // ==========================================
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const handleStatusFilterChange = (e) => {
    setPage(1);
    setStatusFilter(e.target.value);
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setSearch("");
    setStatusFilter("");
    setPage(1);
  };

  // ==========================================
  // MODAL ACTIONS
  // ==========================================
  const handleOpenDetails = (pickup) => {
    setSelectedPickup(pickup);
    setNewStatus(pickup.status);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedPickup(null);
    setIsModalOpen(false);
  };

  const handleUpdateStatus = async () => {
    if (!selectedPickup) return;
    setStatusUpdating(true);
    try {
      const response = await API.put(`/admin/pickups/${selectedPickup._id}/status`, {
        status: newStatus,
      });
      if (response.data && response.data.success) {
        alert("Pickup status updated successfully.");
        // Refresh modal data & list
        setSelectedPickup(response.data.pickup);
        fetchPickups();
      }
    } catch (err) {
      console.error("Error updating pickup status:", err);
      alert(err.response?.data?.message || "Failed to update status.");
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleDeletePickup = async () => {
    if (!selectedPickup) return;
    if (!window.confirm("Are you absolutely sure you want to permanently delete this pickup request?")) {
      return;
    }
    setDeleting(true);
    try {
      const response = await API.delete(`/admin/pickups/${selectedPickup._id}`);
      if (response.data && response.data.success) {
        alert("Pickup request deleted successfully.");
        setIsModalOpen(false);
        setSelectedPickup(null);
        fetchPickups();
      }
    } catch (err) {
      console.error("Error deleting pickup request:", err);
      alert("Failed to delete pickup request.");
    } finally {
      setDeleting(false);
    }
  };

  // Helper for Status CSS Classes
  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "status-pending";
      case "Accepted":
        return "status-accepted";
      case "On The Way":
        return "status-ontheway";
      case "Completed":
        return "status-completed";
      case "Cancelled":
        return "status-cancelled";
      default:
        return "status-default";
    }
  };

  return (
    <AdminLayout>
      <div className="manage-pickups-page">
        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}
        <div className="manage-pickups-header">
          <h1>Manage Pickups 📦</h1>
          <p>Monitor, search, update, and manage all platform pickup requests.</p>
        </div>

        {/* ================================= */}
        {/* SEARCH & FILTERS BAR */}
        {/* ================================= */}
        <div className="pickups-filter-bar">
          <form onSubmit={handleSearchSubmit} className="search-form-admin">
            <input
              type="text"
              placeholder="Search by ID, User, or Collector Name..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="admin-search-input"
            />
            <Button text="Search" type="submit" variant="primary" />
          </form>

          <div className="filter-actions-admin">
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="admin-filter-select"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="On The Way">On The Way</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            {(search || statusFilter) && (
              <button onClick={handleClearFilters} className="clear-filters-btn">
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* ================================= */}
        {/* TABLE CARD */}
        {/* ================================= */}
        <div className="pickups-table-card">
          <div className="pickups-table-header">
            <h2>Pickup Requests ({totalPickups})</h2>
          </div>

          {loading ? (
            <p style={{ padding: "20px", color: "var(--text-light)" }}>Loading pickup requests...</p>
          ) : error ? (
            <p style={{ padding: "20px", color: "red" }}>{error}</p>
          ) : (
            <div className="pickups-table-container">
              <div className="pickups-table">
                {/* HEAD */}
                <div className="pickups-row pickups-head">
                  <span>Pickup ID</span>
                  <span>User</span>
                  <span>Collector</span>
                  <span>Date</span>
                  <span>Weight</span>
                  <span>Amount</span>
                  <span>Status</span>
                  <span>Actions</span>
                </div>

                {/* BODY */}
                {pickups && pickups.length > 0 ? (
                  pickups.map((pickup) => (
                    <div key={pickup._id} className="pickups-row">
                      <span className="pickup-id-cell">{pickup.pickupId || pickup._id.substring(0, 8)}</span>
                      <span>{pickup.user?.name || "Unknown User"}</span>
                      <span>{pickup.collector?.name || "Unassigned"}</span>
                      <span>{new Date(pickup.pickupDate).toLocaleDateString()}</span>
                      <span>{pickup.totalWeight} kg</span>
                      <span>₹{(pickup.totalAmount || 0).toLocaleString()}</span>
                      <span>
                        <span className={`status-pill ${getStatusClass(pickup.status)}`}>
                          {pickup.status}
                        </span>
                      </span>
                      <div>
                        <Button
                          text="View Details"
                          variant="secondary"
                          onClick={() => handleOpenDetails(pickup)}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ padding: "30px", color: "var(--text-light)", textAlign: "center" }}>
                    No pickup requests found matching criteria.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ================================= */}
          {/* PAGINATION CONTROLS */}
          {/* ================================= */}
          {!loading && totalPages > 1 && (
            <div className="admin-pagination">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="pagination-btn"
              >
                &larr; Previous
              </button>
              <span className="pagination-info">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className="pagination-btn"
              >
                Next &rarr;
              </button>
            </div>
          )}
        </div>

        {/* ================================= */}
        {/* DETAILS MODAL */}
        {/* ================================= */}
        {selectedPickup && (
          <Modal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            title={`Pickup Details - ${selectedPickup.pickupId || selectedPickup._id}`}
          >
            <div className="pickup-modal-details">
              <div className="details-grid-admin">
                {/* Column 1: Info */}
                <div className="details-col-admin">
                  <h3>Customer & Slot Info</h3>
                  <p><strong>Customer Name:</strong> {selectedPickup.user?.name || "N/A"}</p>
                  <p><strong>Customer Email:</strong> {selectedPickup.user?.email || "N/A"}</p>
                  <p><strong>Customer Phone:</strong> {selectedPickup.user?.phone || "N/A"}</p>
                  <p><strong>Pickup Date:</strong> {new Date(selectedPickup.pickupDate).toLocaleDateString()}</p>
                  <p><strong>Time Slot:</strong> {selectedPickup.pickupTimeSlot}</p>
                  <p><strong>Payment Method:</strong> {selectedPickup.paymentMethod} ({selectedPickup.paymentStatus})</p>
                  {selectedPickup.notes && <p><strong>Notes:</strong> "{selectedPickup.notes}"</p>}
                </div>

                {/* Column 2: Address & Collector */}
                <div className="details-col-admin">
                  <h3>Location & Collector</h3>
                  <p><strong>Address:</strong> {selectedPickup.address}</p>
                  <p><strong>City/State:</strong> {selectedPickup.city}, {selectedPickup.state} - {selectedPickup.pincode}</p>
                  <p><strong>Assigned Collector:</strong> {selectedPickup.collector?.name || "Unassigned"}</p>
                  {selectedPickup.collector && (
                    <>
                      <p><strong>Collector Email:</strong> {selectedPickup.collector.email}</p>
                      <p><strong>Collector Phone:</strong> {selectedPickup.collector.phone}</p>
                    </>
                  )}
                  {selectedPickup.status === "Cancelled" && selectedPickup.cancellationReason && (
                    <p className="cancel-reason-p"><strong>Cancellation Reason:</strong> "{selectedPickup.cancellationReason}"</p>
                  )}
                </div>
              </div>

              {/* Materials Table */}
              <div className="modal-materials-section">
                <h3>Requested Materials</h3>
                <div className="modal-materials-table">
                  <div className="materials-row-head">
                    <span>Material Type</span>
                    <span>Price/kg</span>
                    <span>Estimated Weight</span>
                    <span>Estimated Amount</span>
                  </div>
                  {selectedPickup.materials && selectedPickup.materials.map((m, idx) => (
                    <div key={idx} className="materials-row-item">
                      <span>{m.materialType}</span>
                      <span>₹{m.pricePerKg}/kg</span>
                      <span>{m.estimatedWeight} kg</span>
                      <span>₹{(m.estimatedAmount || 0).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="materials-row-total">
                    <span>Total Weight & Amount</span>
                    <span></span>
                    <span>{selectedPickup.totalWeight} kg</span>
                    <span>₹{(selectedPickup.totalAmount || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Admin Actions */}
              <div className="modal-actions-section">
                <div className="update-status-admin-container">
                  <label htmlFor="modal-status-select"><strong>Update Status:</strong></label>
                  <select
                    id="modal-status-select"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="modal-status-select-field"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Accepted">Accepted</option>
                    <option value="On The Way">On The Way</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <Button
                    text={statusUpdating ? "Saving..." : "Save Status"}
                    variant="primary"
                    onClick={handleUpdateStatus}
                    disabled={statusUpdating}
                  />
                </div>

                <div className="danger-actions-admin">
                  <Button
                    text={deleting ? "Deleting..." : "Delete Pickup Request"}
                    variant="danger"
                    onClick={handleDeletePickup}
                    disabled={deleting}
                  />
                  <Button
                    text="Close Details"
                    variant="secondary"
                    onClick={handleCloseModal}
                  />
                </div>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManagePickups;
