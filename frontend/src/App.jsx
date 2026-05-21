import React from "react";
import { Toaster } from "react-hot-toast";

import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <div className="app-container">
      <Toaster position="top-right" reverseOrder={false} />
      <AppRoutes />
    </div>
  );
}

export default App;