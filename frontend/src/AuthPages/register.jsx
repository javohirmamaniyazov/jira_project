import axios from "axios";
import { useRef, useState } from "react"; // Import useState
import { Link } from "react-router-dom";
import axiosClient from "../ApiConnection/axiosClient";
import { useStateContext } from "../contexts/contextprovider";

export default function Register() { // Capitalize component name
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const [errors, setErrors] = useState({}); // State for errors

    const { setUser, setToken } = useStateContext();

    const handleSubmit = (ev) => {
        ev.preventDefault();
        const payload = {
            name: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
        }
        axiosClient.post("/register", payload)
            .then(({ data }) => {
                setUser(data.user);
                setToken(data.token);
            })
            .catch(err => {
                if (err.response && err.response.status === 422) {
                    setErrors(err.response.data.errors); // Set errors state
                }
            });
    }

    return (
        <div className="login-signup-form animated fadeinDown">
            <div className="form">
                <h1 className="title">
                    Create A New Account
                </h1>
                <form onSubmit={handleSubmit}>
                    {/* Display errors below each input */}
                    <input ref={nameRef} type="name" placeholder="Name" />
                    {errors.name && <p className="error">{errors.name[0]}</p>}
                    <input ref={emailRef} type="email" placeholder="Email" />
                    {errors.email && <p className="error">{errors.email[0]}</p>}
                    <input ref={passwordRef} type="password" placeholder="Password" />
                    {errors.password && <p className="error">{errors.password[0]}</p>}
                    <button className="btn btn-block">Register</button>
                    <p className="message">
                        Already Have An Account? <Link to='/login'>Login</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}
