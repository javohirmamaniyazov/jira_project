import React, { useEffect, useState } from "react";
import Sidebar from "../views/Sidebar/Sidebar";
import Navbar from "../views/Navbar/Navbar";
import WeeksSection from "../views/Weeks/WeeksPage";
import { useStateContext } from "../contexts/contextprovider";
import TaskForm from "../views/TaskForm/TaskForm";
import axiosClient from "../ApiConnection/axiosClient";
import { MdMoreVert } from "react-icons/md";

export default function WeekLayout() {
  const { token } = useStateContext();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [userId, setUserId] = useState(null);

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

  useEffect(() => {
    if (selectedDate && userId) {
      fetchSelectedDayTasks(selectedDate);
    }
  }, [selectedDate, userId]);

  const fetchSelectedDayTasks = (date) => {
    axiosClient
      .get("/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const todayTasks = response.data.filter(
          (task) =>
            task.date === date.toISOString().slice(0, 10) &&
            task.user_id === userId
        );
        setTasks(todayTasks);
      })
      .catch((error) => {
        // console.error("Error fetching today's tasks:", error);
        setTasks([]);
      });
  };

  const handleDaySelect = (date) => {
    setSelectedDate(date);
    fetchSelectedDayTasks(date);
  };

  const handleChangeStatus = async (taskId, newStatus) => {
    try {
      await axiosClient.put(
        `/tasks/${taskId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchSelectedDayTasks();
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleDeleteTask = (taskId) => {
    axiosClient
      .delete(`/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        fetchSelectedDayTasks();
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
      });
  };

  const toggleDropdown = (taskId) => {
    setOpenDropdownId(openDropdownId === taskId ? null : taskId);
  };

  const renderTasks = (status) => {
    return tasks
      .filter((task) => task.status === status)
      .map((task) => (
        <li key={task.id} className="task-item">
          <span>{task.content}</span>
          <span>{task.date}</span>
          {openDropdownId === task.id && (
            <div className="dropdown-menu">
              {status !== "done" && (
                <button
                  onClick={() => handleChangeStatus(task.id, "in progress")}
                >
                  {status === "created" ? "In progress" : "Done"}
                </button>
              )}
              <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
            </div>
          )}
          <MdMoreVert
            onClick={() => toggleDropdown(task.id)}
            className="more-icon"
            size={21}
          />
        </li>
      ));
  };

  return (
    <div className="layout">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <div style={{ display: "block", width: "85%" }}>
          <WeeksSection
            selectedDate={selectedDate}
            onDaySelect={handleDaySelect}
          />
          {selectedDate && (
            <>
              <h2 style={{ margin: "5px", marginLeft: "20px" }}>
                Tasks for{" "}
                {selectedDate.toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </h2>

              <div className="task-sections">
                <div className="task-section">
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <h3 style={{ marginLeft: "10px" }}>To do</h3>
                  </div>
                  <div className="task-input">
                    <TaskForm selectedDate={selectedDate} />
                  </div>
                  <ul className="task-list">{renderTasks("created")}</ul>
                </div>
                <div className="task-section">
                  <h3 style={{ marginLeft: "10px", float: "left" }}>
                    In Progress
                  </h3>
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
                                onClick={() =>
                                  handleChangeStatus(task.id, "done")
                                }
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
