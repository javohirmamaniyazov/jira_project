import axiosClient from "../ApiConnection/axiosClient";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const [errors, setErrors] = useState(null);
    const [registrationMessage, setRegistrationMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const payload = {
            name: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
        };

        try {
            const response = await axiosClient.post("/register", payload);
            setRegistrationMessage(response.data.message);
            setErrors(null);
            setShowModal(true);
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                console.error("Error registering user:", error);
            }
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        navigate('/login');
    };

    return (
        <div className="login-signup-form animated fadeinDown">
            <div className="form">
                <h1 className="title">Create A New Account</h1>
                <form onSubmit={handleSubmit}>
                    <input ref={nameRef} type="name" placeholder="Name" />
                    {errors && errors.name && <p className="error">{errors.name[0]}</p>}
                    <input ref={emailRef} type="email" placeholder="Email" />
                    {errors && errors.email && <p className="error">{errors.email[0]}</p>}
                    <input ref={passwordRef} type="password" placeholder="Password" />
                    {errors && errors.password && <p className="error">{errors.password[0]}</p>}
                    <button className="btn btn-block">Register</button>
                    <p className="message">
                        Already Have An Account? <Link to="/login">Login</Link>
                    </p>
                </form>
                {registrationMessage && <p>{registrationMessage}</p>}
            </div>
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <p>An email verification link has been sent to your email address. Please verify your email before logging in.</p>
                        <span className="close" style={{ border: '1px solid blue', borderRadius: '3px',  backgroundColor: 'blue', padding: '2px', margin: '5px'}} onClick={handleCloseModal}>Close</span>
                    </div>
                </div>
            )}
        </div>
    );
}
