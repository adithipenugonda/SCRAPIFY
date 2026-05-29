import React, { useState } from "react";
import { motion } from "framer-motion";
import UserLayout from "../../layouts/UserLayout";
import Modal from "../../components/common/Modal";
import API from "../../services/api";
import "./SchedulePickup.css";

const scrapItemsData = [
  { id: 1, name: "Newspaper", price: 14.5, icon: "📰" },
  { id: 2, name: "Cardboard", price: 8.2, icon: "📦" },
  { id: 3, name: "Plastic", price: 12, icon: "🧴" },
  { id: 4, name: "Iron Scrap", price: 28, icon: "🔩" },
  { id: 5, name: "Copper", price: 412, icon: "🪙" },
  { id: 6, name: "Aluminum", price: 145, icon: "🥫" },
  { id: 7, name: "E-Waste", price: 95, icon: "💻" },
  { id: 8, name: "Glass", price: 3.5, icon: "🍾" },
];

const pickupSlots = [
  "Today, 4-6 PM",
  "Tomorrow, 9-11 AM",
  "Tomorrow, 4-6 PM",
  "Sat, 10 AM-12 PM",
];

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const cardEntrance = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

const SchedulePickup = () => {
  const [selectedItems, setSelectedItems] = useState({});
  const [selectedSlot, setSelectedSlot] = useState("Today, 4-6 PM");
  const [openModal, setOpenModal] = useState(false);

  const increaseQty = (id) => {
    setSelectedItems((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const decreaseQty = (id) => {
    setSelectedItems((prev) => ({
      ...prev,
      [id]: prev[id] > 0 ? prev[id] - 1 : 0,
    }));
  };

  // Calculations
  const totalWeight = Object.values(selectedItems).reduce((a, b) => a + b, 0);
  const totalPayout = scrapItemsData.reduce((total, item) => {
    return total + (selectedItems[item.id] || 0) * item.price;
  }, 0);
  const greenPoints = totalWeight * 34;

  const handleConfirmPickup = async () => {
    try {
      await API.post("/pickups/create", {
        materials: scrapItemsData
          .filter((item) => selectedItems[item.id] > 0)
          .map((item) => ({
            materialType: item.name,
            estimatedWeight: selectedItems[item.id],
            pricePerKg: item.price,
          })),
        totalWeight,
        pickupTimeSlot: selectedSlot,
        pickupDate: new Date(),
        address: "Hyderabad",
        city: "Hyderabad",
        state: "Telangana",
        pincode: "500081",
        notes: "Pickup request created",
      });
      setOpenModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <UserLayout>
      <div className="schedule-page">
        {/* HEADER */}
        <motion.div 
          className="schedule-header"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="schedule-small-tag">01 / WHAT ARE YOU RECYCLING?</span>
          <h1>Schedule Scrap Pickup 🚚</h1>
          <p>Select scrap materials, pickup slot, and confirm your recycling request.</p>
        </motion.div>

        {/* MAIN LAYOUT */}
        <div className="schedule-layout">
          {/* LEFT SECTION */}
          <div className="schedule-left">
            {/* SCRAP GRID */}
            <motion.div 
              className="scrap-grid"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {scrapItemsData.map((item) => {
                const qty = selectedItems[item.id] || 0;
                const isActive = qty > 0;

                return (
                  <motion.div
                    key={item.id}
                    variants={cardEntrance}
                    className={`scrap-card neo-card-flat ${isActive ? "active-card glowing-neon-border" : ""}`}
                    whileHover={{ y: -4 }}
                  >
                    <div className="scrap-top">
                      <span className="scrap-icon">{item.icon}</span>
                      
                      <div className="qty-controls">
                        <motion.button
                          className="neo-btn-tactile qty-btn"
                          onClick={() => decreaseQty(item.id)}
                          whileTap={{ scale: 0.9 }}
                        >
                          −
                        </motion.button>
                        <span className="qty-number">{qty}</span>
                        <motion.button
                          className="neo-btn-tactile qty-btn"
                          onClick={() => increaseQty(item.id)}
                          whileTap={{ scale: 0.9 }}
                        >
                          +
                        </motion.button>
                      </div>
                    </div>

                    <h3>{item.name}</h3>
                    <p className="scrap-price">₹{item.price}/kg</p>
                    <span className="scrap-weight">EST. WEIGHT: {qty} KG</span>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* PICKUP SLOT */}
            <motion.div 
              className="pickup-slot-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="schedule-small-tag">02 / PICKUP SLOT</span>
              <div className="pickup-slots">
                {pickupSlots.map((slot) => {
                  const isSelected = selectedSlot === slot;
                  return (
                    <motion.button
                      key={slot}
                      className={`slot-btn neo-btn-tactile ${isSelected ? "active-slot" : ""}`}
                      onClick={() => setSelectedSlot(slot)}
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {slot}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* RIGHT SUMMARY */}
          <motion.div 
            className="summary-card cyber-panel glowing-neon-border"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span className="summary-tag">ORDER SUMMARY</span>
            <h2>₹{totalPayout.toFixed(0)}</h2>
            <p className="summary-subtext">Estimated payout • Final on weighing</p>

            <div className="summary-row">
              <span>Total weight</span>
              <strong>{totalWeight} kg</strong>
            </div>

            <div className="summary-row">
              <span>Pickup slot</span>
              <strong>{selectedSlot}</strong>
            </div>

            <div className="summary-row">
              <span>Collector fee</span>
              <strong className="green">Free</strong>
            </div>

            <div className="summary-row">
              <span>Green Points</span>
              <strong className="green">+{greenPoints}</strong>
            </div>

            <motion.button
              className="confirm-btn neo-btn-tactile"
              onClick={handleConfirmPickup}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Confirm Pickup
            </motion.button>

            <p className="summary-note">CANCEL FREE UP TO 1HR BEFORE</p>
          </motion.div>
        </div>

        {/* SUCCESS MODAL */}
        <Modal
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          title="Pickup Scheduled"
        >
          <div className="pickup-success">
            <h3>Request Submitted 🎉</h3>
            <p>Your scrap pickup has been scheduled successfully. An eco-collector will accept the request shortly.</p>
          </div>
        </Modal>
      </div>
    </UserLayout>
  );
};

export default SchedulePickup;