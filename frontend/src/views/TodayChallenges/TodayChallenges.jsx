import React, { useState, useEffect } from "react";
import "./TodayChallenges.css";
import axiosClient from "../../ApiConnection/axiosClient";
import { useStateContext } from "../../contexts/contextprovider";
import { MdMoreVert } from "react-icons/md";

const TodaysChallenges = ({ user }) => {
  const { token } = useStateContext();
  const [currentDay, setCurrentDay] = useState("");
  const [content, setContent] = useState("");
  const [tasks, setTasks] = useState([]);
  const [today, setToday] = useState("");
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [userId, setUserId] = useState(null);

  const toggleDropdown = (taskId) => {
    setOpenDropdownId(openDropdownId === taskId ? null : taskId);
  };

  useEffect(() => {
    const date = new Date();
    const formattedDate = date.toISOString().slice(0, 10);
    setToday(formattedDate);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const formattedCurrentDay = `${day}.${month}.${year}`;
    setCurrentDay(formattedCurrentDay);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosClient.get("/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserId(response.data.id); // Set the user ID
      } catch (error) {
        // Handle error here
      }
    };

    fetchUser(); // Fetch user information when the component mounts
  }, [token]);

  const fetchTasks = async () => {
    try {
      const response = await axiosClient.get("/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const todayTasks = response.data.filter(
        (task) => task.date === today && task.user_id === userId
      );
      setTasks(todayTasks);
      localStorage.setItem("tasks", JSON.stringify(todayTasks));
    } catch (error) {
      console.error("Error fetching tasks:", error);
      const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
      setTasks(storedTasks);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [today, userId, token]);

  const handleChangeStatus = (taskId, newStatus) => {
    axiosClient
      .put(
        `/tasks/${taskId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        fetchTasks();
      })
      .catch((error) => {
        console.error("Error updating task status:", error);
      });
  };

  const handleDeleteTask = (taskId) => {
    axiosClient
      .delete(`/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        fetchTasks();
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
      });
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    axiosClient
      .post(
        "/tasks",
        { content, date: today, status: "created", user_id: userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setContent("");
        fetchTasks();
      })
      .catch((error) => {
        console.error("Error adding task:", error);
      });
  };

  return (
    <div className="today-challenges">
      <h2 className="current-day">Today {currentDay}</h2>
      <div className="task-sections">
        <div className="task-section">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3 style={{ marginLeft: "10px" }}>To do</h3>
          </div>
          <div className="task-input">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Add a task"
              />
              <button type="submit">Add</button>
            </form>
          </div>
          <ul className="task-list">
            {tasks
              .filter((task) => task.status === "created")
              .map((task) => (
                <li key={task.id} className="task-item">
                  <span>{task.content}</span>
                  <span>{task.date}</span>
                  {openDropdownId === task.id && (
                    <div className="dropdown-menu">
                      <button
                        onClick={() =>
                          handleChangeStatus(task.id, "in progress")
                        }
                      >
                        In Progress
                      </button>
                      <button onClick={() => handleDeleteTask(task.id)}>
                        Delete
                      </button>
                    </div>
                  )}
                  <MdMoreVert
                    onClick={() => toggleDropdown(task.id)}
                    className="more-icon"
                    size={21}
                  />
                </li>
              ))}
          </ul>
        </div>
        <div className="task-section">
          <h3 style={{ marginLeft: "10px", float: "left" }}>In Progress</h3>
          <ul className="task-list">
            {tasks
              .filter((task) => task.status === "in progress")
              .map((task) => (
                <li key={task.id} className="task-item">
                  <span>{task.content}</span>
                  <span>{task.date}</span>
                  {openDropdownId === task.id && (
                    <div className="dropdown-menu">
                      <button
                        onClick={() => handleChangeStatus(task.id, "done")}
                      >
                        Done
                      </button>
                      <button onClick={() => handleDeleteTask(task.id)}>
                        Delete
                      </button>
                    </div>
                  )}
                  <MdMoreVert
                    onClick={() => toggleDropdown(task.id)}
                    className="more-icon"
                    size={21}
                  />
                </li>
              ))}
          </ul>
        </div>
        <div className="task-section">
          <h3 style={{ marginLeft: "10px", float: "left" }}>Done</h3>
          <ul className="task-list">
            {tasks
              .filter((task) => task.status === "done")
              .map((task) => (
                <li key={task.id} className="task-item">
                  <span>{task.content}</span>
                  <span>{task.date}</span>
                  {openDropdownId === task.id && (
                    <div className="dropdown-menu">
                      <button onClick={() => handleDeleteTask(task.id)}>
                        Delete
                      </button>
                    </div>
                  )}

                  <MdMoreVert
                    onClick={() => toggleDropdown(task.id)}
                    className="more-icon"
                    size={21}
                  />
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TodaysChallenges;
