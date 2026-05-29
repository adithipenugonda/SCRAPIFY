import React, { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import Button from "../../components/common/Button";
import API from "../../services/api";
import "./ManagePrices.css";

const ManagePrices = () => {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchPrices = async () => {
    try {
      const response = await API.get("/scrap-prices");
      if (response.data && response.data.scrapPrices) {
        setPrices(response.data.scrapPrices);
      }
    } catch (err) {
      console.error("Error fetching scrap prices:", err);
      setError("Failed to load scrap prices.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  const handlePriceChange = (id, value) => {
    setPrices((prevPrices) =>
      prevPrices.map((item) =>
        item._id === id
          ? {
              ...item,
              pricePerKg: parseFloat(value) || 0,
            }
          : item
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Perform updates sequentially or in parallel for all materials
      const promises = prices.map((item) =>
        API.put(`/scrap-prices/${item._id}`, {
          pricePerKg: item.pricePerKg,
        })
      );
      await Promise.all(promises);
      alert("Scrap prices updated successfully in database!");
      fetchPrices();
    } catch (err) {
      console.error("Error saving scrap prices:", err);
      alert("Failed to update scrap prices on the server.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="manage-prices-page">
        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}
        <div className="manage-prices-header">
          <h1>Manage Scrap Prices 💰</h1>
          <p>Update and control market prices for recyclable materials.</p>
        </div>

        {/* ================================= */}
        {/* PRICE TABLE */}
        {/* ================================= */}
        <div className="prices-card neo-card-flat glowing-neon-border">
          <div className="prices-header">
            <h2>Current Scrap Rates</h2>
          </div>

          {loading ? (
            <p style={{ padding: "20px", color: "var(--text-light)" }}>Loading rates...</p>
          ) : error ? (
            <p style={{ padding: "20px", color: "red" }}>{error}</p>
          ) : (
            <div className="prices-table">
              {/* TABLE HEAD */}
              <div className="prices-row prices-head">
                <span>Material</span>
                <span>Price per KG</span>
                <span>Update Price</span>
              </div>

              {/* TABLE BODY */}
              {prices && prices.length > 0 ? (
                prices.map((item) => (
                  <div key={item._id} className="prices-row">
                    <span>♻️ {item.materialType}</span>
                    <span className="price-value">₹{item.pricePerKg}/kg</span>
                    <input
                      type="number"
                      value={item.pricePerKg}
                      onChange={(e) =>
                        handlePriceChange(item._id, e.target.value)
                      }
                      min="0"
                      step="0.5"
                    />
                  </div>
                ))
              ) : (
                <p style={{ padding: "20px", color: "var(--text-light)", textAlign: "center" }}>
                  No materials found in system.
                </p>
              )}
            </div>
          )}

          {/* BUTTON */}
          {!loading && !error && (
            <div className="save-btn-container">
              <Button
                text={saving ? "Saving..." : "Save Changes"}
                icon="💾"
                onClick={handleSave}
                disabled={saving}
              />
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManagePrices;