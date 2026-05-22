import React from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import UserLayout from "../../layouts/UserLayout";

import "./TrackPickup.css";

const TrackPickup = () => {

  // Example collector coordinates
  const collectorPosition = [
    17.4474,
    78.3762,
  ];

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
        {/* MAP SECTION */}
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
        {/* TRACKING INFO */}
        {/* ================================= */}

        <div className="tracking-info-grid">


          <div className="tracking-info-card">

            <span>
              Collector
            </span>

            <h3>
              Ravi Kumar
            </h3>

          </div>


          <div className="tracking-info-card">

            <span>
              Pickup Status
            </span>

            <h3>
              On The Way
            </h3>

          </div>


          <div className="tracking-info-card">

            <span>
              Estimated Arrival
            </span>

            <h3>
              12 mins
            </h3>

          </div>


          <div className="tracking-info-card">

            <span>
              Vehicle
            </span>

            <h3>
              Mini Truck
            </h3>

          </div>


        </div>

      </div>

    </UserLayout>

  );

};

export default TrackPickup;