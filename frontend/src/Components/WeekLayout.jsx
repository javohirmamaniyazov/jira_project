import React, { useEffect, useState } from "react";
import Sidebar from "../views/Sidebar/Sidebar";
import Navbar from "../views/Navbar/Navbar";
import WeeksSection from "../views/Weeks/WeeksPage";
import { useStateContext } from '../contexts/contextprovider'
import TaskForm from "../views/TaskForm/TaskForm";
import axiosClient from "../ApiConnection/axiosClient";
import { MdMoreVert } from "react-icons/md";

export default function WeekLayout() {
  const { token } = useStateContext();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const handleDaySelect = (date) => {
    setSelectedDate(date);
    fetchSelectedDayTasks(date);
  };

  const fetchSelectedDayTasks = (date) => {
    axiosClient
      .get("/tasks")
      .then((response) => {
        const todayTasks = response.data.filter(
          (task) => task.date === date.toISOString().slice(0, 10)
        );
        setTasks(todayTasks);
      })
      .catch((error) => {
        // console.error("Error fetching today's tasks:", error);
        setTasks([]);
      });
  };

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
        // console.log("Task status updated successfully:", response.data);
        fetchSelectedDayTasks(selectedDate);
      })
      .catch((error) => {
        // console.error("Error updating task status:", error);
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
        // console.log("Task deleted successfully:", response.data);
        fetchSelectedDayTasks(selectedDate); // Refetch today's tasks after deleting
      })
      .catch((error) => {
        // console.error("Error deleting task:", error);
      });
  };

  const toggleDropdown = (taskId) => {
    setOpenDropdownId(openDropdownId === taskId ? null : taskId);
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
