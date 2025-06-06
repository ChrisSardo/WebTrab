import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Tasks from "../pages/Tasks";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tasks" element={<Tasks />} />
      </Routes>
    </BrowserRouter>
  );
}
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";