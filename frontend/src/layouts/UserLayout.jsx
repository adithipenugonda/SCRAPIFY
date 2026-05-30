import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import Footer from "../components/common/Footer";
import API from "../services/api";
import "./UserLayout.css";

const UserLayout = ({
  children,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const statusMapRef = useRef({});

  const trackPickupStatuses = async () => {
    try {
      const response = await API.get("/pickups/my-pickups");
      if (response.data && response.data.pickups) {
        const currentPickups = response.data.pickups;
        
        currentPickups.forEach((pickup) => {
          const id = pickup._id;
          const currentStatus = pickup.status;
          const previousStatus = statusMapRef.current[id];
          
          if (previousStatus && previousStatus !== currentStatus) {
            // Trigger notifications based on transitions
            if (currentStatus === "Accepted") {
              toast.success(`Your pickup request ${pickup.pickupId || ""} has been accepted! 🚚`, {
                icon: "🚚",
                duration: 6000,
                style: {
                  borderRadius: "12px",
                  background: "#060b08",
                  color: "#fff",
                },
              });
            } else if (currentStatus === "On The Way") {
              toast.success(`Collector is on the way for pickup ${pickup.pickupId || ""}! 📍`, {
                icon: "📍",
                duration: 6000,
                style: {
                  borderRadius: "12px",
                  background: "#060b08",
                  color: "#fff",
                },
              });
            } else if (currentStatus === "Completed") {
              toast.success(`Pickup ${pickup.pickupId || ""} completed! Thank you for recycling. 🌱`, {
                icon: "🌱",
                duration: 6000,
                style: {
                  borderRadius: "12px",
                  background: "#060b08",
                  color: "#fff",
                },
              });
            }
          }
          
          // Update the ref map
          statusMapRef.current[id] = currentStatus;
        });

        // Clean up statusMapRef for deleted pickups
        const currentIds = currentPickups.map((p) => p._id);
        Object.keys(statusMapRef.current).forEach((id) => {
          if (!currentIds.includes(id)) {
            delete statusMapRef.current[id];
          }
        });
      }
    } catch (error) {
      console.error("Error in background status tracking:", error);
    }
  };

  useEffect(() => {
    // Initial fetch to populate map without triggering toasts
    trackPickupStatuses();

    const interval = setInterval(() => {
      trackPickupStatuses();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="user-layout">

      {/* ===================================== */}
      {/* SIDEBAR */}
      {/* ===================================== */}

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />


      {/* ===================================== */}
      {/* MAIN CONTENT */}
      {/* ===================================== */}

      <div className="user-layout-main">

        {/* NAVBAR */}
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />


        {/* PAGE CONTENT */}
        <main className="user-layout-content">

          {children}

        </main>


        {/* FOOTER */}
        <Footer />

      </div>

    </div>
  );
};

export default UserLayout;