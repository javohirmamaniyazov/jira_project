import React, { useEffect, useState } from "react";
import MonthsSection from "../views/Month/MonthPage";
import Sidebar from "../views/Sidebar/Sidebar";
import Navbar from "../views/Navbar/Navbar";
import { useStateContext } from "../contexts/contextprovider"
import { Navigate, Outlet } from "react-router-dom";


export default function MonthLayout() {
  const { token} = useStateContext();
  const [isEmailVerified, setIsEmailVerified] = useState(null);

  useEffect(() => {
    const fetchEmailVerificationStatus = async () => {
      try {
        const response = await axiosClient.get("/user/email-verified", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsEmailVerified(response.data);
      } catch (error) {
        console.error("Error fetching email verification status:", error);
        setIsEmailVerified(false); // Set as false by default if error occurs
      }
    };

    if (token) {
      fetchEmailVerificationStatus();
    }
  }, [token]);

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (isEmailVerified === null) {
    return <p>Loading...</p>;
  } else if (!isEmailVerified) {
    return (
      <div>
        <p>Your email is not verified. Please verify your email.</p>
        {/* You can render a button or link to trigger the email verification process */}
      </div>
    );
  }

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
