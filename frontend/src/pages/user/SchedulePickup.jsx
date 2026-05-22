import React, {
  useState,
} from "react";

import UserLayout from "../../layouts/UserLayout";

import Modal from "../../components/common/Modal";

import "./SchedulePickup.css";

const scrapItemsData = [
  {
    id: 1,
    name: "Newspaper",
    price: 14.5,
    icon: "📰",
  },
  {
    id: 2,
    name: "Cardboard",
    price: 8.2,
    icon: "📦",
  },
  {
    id: 3,
    name: "Plastic (PET)",
    price: 12,
    icon: "🧴",
  },
  {
    id: 4,
    name: "Iron Scrap",
    price: 28,
    icon: "🔩",
  },
  {
    id: 5,
    name: "Copper",
    price: 412,
    icon: "🪙",
  },
  {
    id: 6,
    name: "Aluminum",
    price: 145,
    icon: "🥫",
  },
  {
    id: 7,
    name: "E-Waste",
    price: 95,
    icon: "💻",
  },
  {
    id: 8,
    name: "Glass",
    price: 3.5,
    icon: "🍾",
  },
];

const pickupSlots = [
  "Today, 4-6 PM",
  "Tomorrow, 9-11 AM",
  "Tomorrow, 4-6 PM",
  "Sat, 10 AM-12 PM",
];

const SchedulePickup = () => {

  const [selectedItems, setSelectedItems] =
    useState({});

  const [selectedSlot, setSelectedSlot] =
    useState("Today, 4-6 PM");

  const [openModal, setOpenModal] =
    useState(false);

  // ==========================================
  // HANDLE QUANTITY
  // ==========================================

  const increaseQty = (id) => {
    setSelectedItems((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const decreaseQty = (id) => {
    setSelectedItems((prev) => ({
      ...prev,
      [id]:
        prev[id] > 0
          ? prev[id] - 1
          : 0,
    }));
  };

  // ==========================================
  // CALCULATIONS
  // ==========================================

  const totalWeight = Object.values(
    selectedItems
  ).reduce((a, b) => a + b, 0);

  const totalPayout =
    scrapItemsData.reduce(
      (total, item) => {
        return (
          total +
          (selectedItems[item.id] || 0) *
            item.price
        );
      },
      0
    );

  const greenPoints =
    totalWeight * 34;

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleConfirmPickup = () => {
    setOpenModal(true);
  };

  return (
    <UserLayout>

      <div className="schedule-page">

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div className="schedule-header">

          <span className="schedule-small-tag">
            01 / WHAT ARE YOU RECYCLING?
          </span>

          <h1>
            Schedule Scrap Pickup 🚚
          </h1>

          <p>
            Select scrap materials,
            pickup slot, and confirm
            your recycling request.
          </p>

        </div>

        {/* ================================= */}
        {/* MAIN LAYOUT */}
        {/* ================================= */}

        <div className="schedule-layout">

          {/* LEFT SECTION */}
          <div className="schedule-left">

            {/* SCRAP GRID */}
            <div className="scrap-grid">

              {scrapItemsData.map(
                (item) => {

                  const qty =
                    selectedItems[
                      item.id
                    ] || 0;

                  return (
                    <div
                      key={item.id}
                      className={`scrap-card ${
                        qty > 0
                          ? "active"
                          : ""
                      }`}
                    >

                      <div className="scrap-top">

                        <span className="scrap-icon">
                          {item.icon}
                        </span>

                        <div className="qty-controls">

                          <button
                            onClick={() =>
                              decreaseQty(
                                item.id
                              )
                            }
                          >
                            −
                          </button>

                          <span>
                            {qty}
                          </span>

                          <button
                            onClick={() =>
                              increaseQty(
                                item.id
                              )
                            }
                          >
                            +
                          </button>

                        </div>

                      </div>

                      <h3>
                        {item.name}
                      </h3>

                      <p className="scrap-price">
                        ₹{item.price}/kg
                      </p>

                      <span className="scrap-weight">
                        EST. WEIGHT:
                        {" "}
                        {qty} KG
                      </span>

                    </div>
                  );
                }
              )}

            </div>

            {/* PICKUP SLOT */}
            <div className="pickup-slot-section">

              <span className="schedule-small-tag">
                02 / PICKUP SLOT
              </span>

              <div className="pickup-slots">

                {pickupSlots.map(
                  (slot) => (
                    <button
                      key={slot}
                      className={`slot-btn ${
                        selectedSlot ===
                        slot
                          ? "active-slot"
                          : ""
                      }`}
                      onClick={() =>
                        setSelectedSlot(
                          slot
                        )
                      }
                    >
                      {slot}
                    </button>
                  )
                )}

              </div>

            </div>

          </div>

          {/* RIGHT SUMMARY */}
          <div className="summary-card">

            <span className="summary-tag">
              ORDER SUMMARY
            </span>

            <h2>
              ₹
              {totalPayout.toFixed(
                0
              )}
            </h2>

            <p className="summary-subtext">
              Estimated payout • Final
              on weighing
            </p>

            <div className="summary-row">
              <span>
                Total weight
              </span>

              <strong>
                {totalWeight} kg
              </strong>
            </div>

            <div className="summary-row">
              <span>
                Pickup slot
              </span>

              <strong>
                {selectedSlot}
              </strong>
            </div>

            <div className="summary-row">
              <span>
                Collector fee
              </span>

              <strong className="green">
                Free
              </strong>
            </div>

            <div className="summary-row">
              <span>
                Green Points
              </span>

              <strong className="green">
                +{greenPoints}
              </strong>
            </div>

            <button
              className="confirm-btn"
              onClick={
                handleConfirmPickup
              }
            >
              Confirm Pickup
            </button>

            <p className="summary-note">
              CANCEL FREE UP TO 1HR
              BEFORE
            </p>

          </div>

        </div>

        {/* SUCCESS MODAL */}

        <Modal
          isOpen={openModal}
          onClose={() =>
            setOpenModal(false)
          }
          title="Pickup Scheduled"
        >

          <div className="pickup-success">

            <h3>
              Pickup Request Submitted
            </h3>

            <p>
              Your scrap pickup has
              been scheduled
              successfully.
            </p>

          </div>

        </Modal>

      </div>

    </UserLayout>
  );
};

export default SchedulePickup;