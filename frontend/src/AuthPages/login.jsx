import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../ApiConnection/axiosClient";
import { useStateContext } from "../contexts/contextprovider";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { setUser, setToken } = useStateContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    axiosClient
      .post("/login", { email, password })
      .then(({ data }) => {
        setUser(data.user);
        setToken(data.token);
      })
      .catch((err) => {
        if (err.response.status === 422) {
          const errors = err.response.data.errors;
          setEmailError(errors.email);
          setPasswordError(errors.password);
        }
      });
  };

  return (
    <div className="login-signup-form animated fadeInDown">
      <div className="form">
        <h1 className="title">Login to Your Account</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input ref={emailRef} type="email" placeholder="Email" />
            {emailError && <p className="error">{emailError}</p>}
          </div>
          <div className="input-group">
            <input ref={passwordRef} type="password" placeholder="Password" />
            {passwordError && <p className="error">{passwordError}</p>}
          </div>
          <button className="btn btn-block">Login</button>
          <p className="message">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
