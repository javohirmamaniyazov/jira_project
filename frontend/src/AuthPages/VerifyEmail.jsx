import { useEffect, useState } from "react";
import axiosClient from "../ApiConnection/axiosClient";
import { useLocation } from "react-router-dom";

export default function VerifyEmail() {
    const [verificationStatus, setVerificationStatus] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await axiosClient.get(location.pathname + location.search);
                setVerificationStatus(response.data.status);
            } catch (error) {
                console.error("Error verifying email:", error);
            }
        };

        verifyEmail();
    }, [location]);

    return (
        <div>
            {verificationStatus === null ? (
                <p>Verifying email...</p>
            ) : verificationStatus === 200 ? (
                <p>Email successfully verified.</p>
            ) : (
                <p>Email verification failed.</p>
            )}
        </div>
    );
}
