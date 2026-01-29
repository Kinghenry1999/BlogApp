import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "../Components/Home";
import About from "../Components/About";
import Login from "../admin/Login";
import Register from "../admin/Register";
import Dashboard from "../admin/dashboard";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin/register" element={<Register />} />
      <Route path="/admin/dashboard" element={<Dashboard />} />
      
    </Routes>
  );
};

export default AppRoutes;
