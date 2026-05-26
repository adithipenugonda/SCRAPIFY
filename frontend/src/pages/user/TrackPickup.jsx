import React, {
  useState,
  useEffect,
} from "react";

import API from "../../services/api";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import UserLayout from "../../layouts/UserLayout";

import "./TrackPickup.css";

const TrackPickup = () => {

  const [pickups, setPickups] =
    useState([]);

  // Example live coordinates
  const collectorPosition = [
    17.4474,
    78.3762,
  ];

  // =====================================
  // FETCH USER PICKUPS
  // =====================================
  const fetchUserPickups = async () => {

    try {

      const response = await API.get(
        "/pickups/my-pickups"
      );

      setPickups(
        response.data.pickups
      );

    } catch (error) {

      console.log(error);

    }

  };

  // =====================================
  // LOAD DATA
  // =====================================
  useEffect(() => {

    fetchUserPickups();

  }, []);

  return (

    <UserLayout>

      <div className="track-page">

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div className="track-header">

          <h1>
            Live Pickup Tracking 📍
          </h1>

          <p>
            Track your assigned collector
            in realtime.
          </p>

        </div>

        {/* ================================= */}
        {/* MAP */}
        {/* ================================= */}

        <div className="track-map-card">

          <MapContainer
            center={collectorPosition}
            zoom={13}
            scrollWheelZoom={true}
            className="live-map"
          >

            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={collectorPosition}>

              <Popup>
                Collector is here 🚚
              </Popup>

            </Marker>

          </MapContainer>

        </div>

        {/* ================================= */}
        {/* PICKUP TRACKING */}
        {/* ================================= */}

        <div className="tracking-info-grid">

          {pickups.map((pickup) => (

            <div
              key={pickup._id}
              className="tracking-info-card"
            >

              <span>
                Material
              </span>

              <h3>
                {
                  pickup.materials?.[0]
                    ?.materialType
                }
              </h3>

              <span>
                Pickup Status
              </span>

              <h3>
                {pickup.status}
              </h3>

              <span>
                Total Amount
              </span>

              <h3>
                ₹{pickup.totalAmount}
              </h3>

              <span>
                Weight
              </span>

              <h3>
                {pickup.totalWeight}kg
              </h3>

              {pickup.collector && (

                <>

                  <span>
                    Collector Assigned
                  </span>

                  <h3>
                    {pickup.collector.name}
                  </h3>

                </>

              )}

            </div>

          ))}

        </div>

      </div>

    </UserLayout>

  );

};

export default TrackPickup;