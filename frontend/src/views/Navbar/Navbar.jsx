import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { FaUserCircle, FaPlus } from "react-icons/fa";
import axiosClient from "../../ApiConnection/axiosClient";
import { useStateContext } from "../../contexts/contextprovider";
import "./Navbar.css";
import arrow from '../../target.png'

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { token, setToken } = useStateContext();
  const [user, setUser] = useState(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosClient.get("/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        // console.error("Error fetching user information:", error);
      }
    };

    if (token) {
      fetchUser();
    }
  }, [token]);

  // Logout function
  const onLogout = (ev) => {
    ev.preventDefault();
    axiosClient
      .get("/logout")
      .then(({}) => {
        setUser(null);
        setToken(null);
      })
      .catch((error) => {
        // console.error("Error logging out:", error);
      });
  };
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/" style={{display: 'flex', marginLeft: '8px'}}><img src={arrow} alt="target" /><p style={{ marginBottom: '1px', marginLeft: '4px'}}>Daily Tasks</p></Link>
      </div>
      <div className="navbar-profile">
        <div className="profile-icon" style={{ display: 'flex'}} onClick={toggleDropdown}>
          {user && <p style={{ fontSize: '18px', marginRight: '5px'}}>Welcome, {user.name}</p>}
          <FaUserCircle size={27} className="profile-icon" />
        </div>
        {isDropdownOpen && (
          <div className="dropdown-menu">
            <a onClick={onLogout} style={{ display: "flex" }}>
              <FiLogOut size={23} />{" "}
              <p style={{ fontSize: "16px", margin: "2px", cursor: "pointer" }}>
                Logout
              </p>
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
