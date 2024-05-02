import React, { useEffect, useState } from "react";
import MonthsSection from "../views/Month/MonthPage";
import Sidebar from "../views/Sidebar/Sidebar";
import Navbar from "../views/Navbar/Navbar";

export default function MonthLayout() {
  return (
    <div className="layout">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <MonthsSection />
      </div>
    </div>
  );
}
