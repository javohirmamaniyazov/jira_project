import { useEffect, useState } from "react";
import { FaUserCircle, FaPlus } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import axiosClient from "../../ApiConnection/axiosClient";
import { useStateContext } from "../../contexts/contextprovider";
import "./Sidebar.css";
import TaskModal from "../TaskForm/TaskModal";

const Sidebar = () => {
  const { token } = useStateContext();
  const [user, setUser] = useState(null); // State to store user information
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateTask = async (task) => {
    try {
      const response = await axiosClient.post("/tasks", task);
      // console.log("Task created successfully:", response.data);
      handleCloseModal();
    } catch (error) {
      // console.error("Error creating task:", error);
      // Handle error here
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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

  return (
    <div className="sidebar">
      <div className="profile">
        <FaUserCircle className="profile-icon" />
        <div className="user-info">
          {/* Display user's name and email */}
          {user && (
            <>
              <p className="user-name">{user.name}</p>
            </>
          )}
        </div>
      </div>
      <div className="sections">
        <div
          className={`section ${
            location.pathname === "/" ? "active" : "inactive"
          }`}
        >
          <Link to="/" style={{ textDecoration: "none" }}>
            Today's Challenges
          </Link>
        </div>
        <div
          className={`section week ${
            location.pathname === "/weeks" ? "active" : "inactive"
          }`}
        >
          <Link to="/weeks" style={{ textDecoration: "none" }}>
            Weekly Tasks
          </Link>
        </div>
        <div
          className={` section month ${
            location.pathname === "/months" ? "active" : "inactive"
          }`}
        >
          <Link to="/months" style={{ textDecoration: "none" }}>
            Monthly Tasks
          </Link>
        </div>
        <div className="section add-task">
          <FaPlus className="add-task-icon" />
          <button onClick={handleOpenModal} style={{ border: 'none'}}>Add Special Task</button>
          <TaskModal
            isOpen={isModalOpen}
            onRequestClose={handleCloseModal}
            onCreateTask={handleCreateTask}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
