import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TransactionStatus from "./pages/TransactionStatus";
import SchoolTransactions from "./pages/SchoolTransactions";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/status" element={<TransactionStatus />} />
      <Route path="/school" element={<SchoolTransactions />} />
    </Routes>
  </BrowserRouter>
);
