import React, { useState, useEffect } from 'react';
import axiosClient from "../ApiConnection/axiosClient";


const EmailVerificationStatus = () => {
    const [isEmailVerified, setIsEmailVerified] = useState(null);

    useEffect(() => {
        const fetchEmailVerificationStatus = async () => {
            try {
                const response = await axiosClient.get('/user/email-verified');
                setIsEmailVerified(response.data);
            } catch (error) {
                console.error('Error fetching email verification status:', error);
            }
        };

        fetchEmailVerificationStatus();
    }, []);

    return (
        <div>
            {isEmailVerified === null ? (
                <p>Loading...</p>
            ) : isEmailVerified ? (
                <p>Your email is verified.</p>
            ) : (
                <p>Your email is not verified. Please verify your email.</p>
            )}
        </div>
    );
};

export default EmailVerificationStatus;