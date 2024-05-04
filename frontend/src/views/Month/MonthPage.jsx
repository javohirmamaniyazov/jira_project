import React, { useState, useEffect } from "react";
import TaskForm from "../TaskForm/TaskForm";
import axiosClient from "../../ApiConnection/axiosClient";
import { MdMoreVert } from "react-icons/md";
import { useStateContext } from "../../contexts/contextprovider";
import "./MonthPage.css";

const MonthsSection = ({ onDaySelect }) => {
  const { token } = useStateContext();
  const [currentWeekDays, setCurrentWeekDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  useEffect(() => {
    const today = new Date();
    const firstDayOfWeek = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - today.getDay() + 1
    );
    const currentWeekDays = [];
    let currentDay = new Date(firstDayOfWeek);
    for (let i = 0; i < 7; i++) {
      currentWeekDays.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }
    setCurrentWeekDays(currentWeekDays);
    setSelectedDate(today); // Set selected date to current day
  }, []);

  const handleDaySelect = (date) => {
    setSelectedDate(date);
    fetchSelectedDayTasks(date);
  };

  const handleNextWeek = () => {
    const nextWeekDays = currentWeekDays.map((date) => {
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 7);
      return nextDate;
    });
    setCurrentWeekDays(nextWeekDays);
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

  const handlePrevWeek = () => {
    const prevWeekDays = currentWeekDays.map((date) => {
      const prevDate = new Date(date);
      prevDate.setDate(prevDate.getDate() - 7);
      return prevDate;
    });
    setCurrentWeekDays(prevWeekDays);
  };

  return (
    <>
      <div className="months-section">
        <div className="months-slider">
          <button onClick={handlePrevWeek} className="prev">
            &lt;
          </button>
          {currentWeekDays.map((date, index) => (
            <div
              key={index}
              className={`week-day ${
                selectedDate &&
                selectedDate.toDateString() === date.toDateString()
                  ? "selected"
                  : ""
              }`}
              onClick={() => handleDaySelect(date)}
            >
              {date.toLocaleDateString("en-US", {
                month: "long",
              })}
              , {date.getFullYear()} year
              <p style={{ margin: "5px" }}>
                {date.toLocaleDateString("en-US", {
                  day: "numeric",
                })}
              </p>
            </div>
          ))}
          <button onClick={handleNextWeek} className="next">
            &gt;
          </button>
        </div>
        {selectedDate && (
          <div className="selected-day-form">
            <h3>
              Selected Day:{" "}
              {selectedDate.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </h3>
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
          </div>
        )}
      </div>
    </>
  );
};

export default MonthsSection;
