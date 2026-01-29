import React from "react";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./Components/Navbar";  // <-- your Navbar file
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
