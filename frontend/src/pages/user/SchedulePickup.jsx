import React, {
  useState,
} from "react";

import UserLayout from "../../layouts/UserLayout";

import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";

import "./SchedulePickup.css";


const SchedulePickup = () => {

  // ==========================================
  // STATES
  // ==========================================
  const [formData, setFormData] =
    useState({
      materialType: "",
      weight: "",
      pickupDate: "",
      pickupTime: "",
      address: "",
    });

  const [openModal, setOpenModal] =
    useState(false);


  // ==========================================
  // HANDLE CHANGE
  // ==========================================
  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]:
        e.target.value,
    });
  };


  // ==========================================
  // HANDLE SUBMIT
  // ==========================================
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);

    setOpenModal(true);
  };


  return (
    <UserLayout>

      <div className="schedule-pickup-page">

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div className="schedule-header">

          <h1>
            Schedule Scrap Pickup 🚚
          </h1>

          <p>
            Select your scrap type,
            preferred time, and
            location for pickup.
          </p>

        </div>


        {/* ================================= */}
        {/* FORM */}
        {/* ================================= */}

        <div className="schedule-form-card">

          <form
            onSubmit={handleSubmit}
          >

            {/* MATERIAL TYPE */}
            <div className="form-group">

              <label>
                Scrap Material
              </label>

              <select
                name="materialType"

                value={formData.materialType}

                onChange={handleChange}

                required
              >

                <option value="">
                  Select Material
                </option>

                <option value="Plastic">
                  Plastic
                </option>

                <option value="Paper">
                  Paper
                </option>

                <option value="Iron">
                  Iron
                </option>

                <option value="E-Waste">
                  E-Waste
                </option>

              </select>

            </div>


            {/* WEIGHT */}
            <div className="form-group">

              <label>
                Estimated Weight (kg)
              </label>

              <input
                type="number"
                name="weight"

                placeholder="Enter estimated weight"

                value={formData.weight}

                onChange={handleChange}

                required
              />

            </div>


            {/* DATE */}
            <div className="form-group">

              <label>
                Pickup Date
              </label>

              <input
                type="date"
                name="pickupDate"

                value={formData.pickupDate}

                onChange={handleChange}

                required
              />

            </div>


            {/* TIME */}
            <div className="form-group">

              <label>
                Pickup Time
              </label>

              <input
                type="time"
                name="pickupTime"

                value={formData.pickupTime}

                onChange={handleChange}

                required
              />

            </div>


            {/* ADDRESS */}
            <div className="form-group">

              <label>
                Pickup Address
              </label>

              <textarea
                name="address"

                rows="4"

                placeholder="Enter pickup address"

                value={formData.address}

                onChange={handleChange}

                required
              ></textarea>

            </div>


            {/* BUTTON */}
            <Button
              text="Schedule Pickup"
              type="submit"
              icon="🚚"
            />

          </form>

        </div>


        {/* ================================= */}
        {/* SUCCESS MODAL */}
        {/* ================================= */}

        <Modal
          isOpen={openModal}

          onClose={() =>
            setOpenModal(false)
          }

          title="Pickup Scheduled"
        >

          <div className="pickup-success">

            <h3>
              🎉 Pickup Request Submitted
            </h3>

            <p>
              Your scrap pickup has
              been scheduled successfully.
            </p>

          </div>

        </Modal>

      </div>

    </UserLayout>
  );
};

export default SchedulePickup;