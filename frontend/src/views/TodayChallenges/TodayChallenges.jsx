import React, { useState, useEffect } from "react";
import "./TodayChallenges.css";
import axiosClient from "../../ApiConnection/axiosClient";
import { useStateContext } from "../../contexts/contextprovider";
import { MdMoreVert } from "react-icons/md";

const TodaysChallenges = () => {
  const { token } = useStateContext();
  const [currentDay, setCurrentDay] = useState("");
  const [content, setContent] = useState("");
  const [tasks, setTasks] = useState([]);
  const [today, setToday] = useState("");
  const [openDropdownId, setOpenDropdownId] = useState(null);
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

  const fetchTodayTasks = () => {
    axiosClient
      .get("/tasks")
      .then((response) => {
        const todayTasks = response.data.filter((task) => task.date === today);
        setTasks(todayTasks);
      })
      .catch((error) => {
        // console.error("Error fetching today's tasks:", error);
        setTasks([]);
      });
  };

  useEffect(() => {
    fetchTodayTasks();
  }, [today]);

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
        fetchTodayTasks();
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
        fetchTodayTasks(); // Refetch today's tasks after deleting
      })
      .catch((error) => {
        // console.error("Error deleting task:", error);
      });
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    axiosClient
      .post(
        "/tasks",
        { content, date: today, status: "created" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        // console.log("Task added successfully:", response.data);
        setContent("");
        fetchTodayTasks(); // Refetch today's tasks after adding a new task
      })
      .catch((error) => {
        // console.error("Error adding task:", error);
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
          <h3 style={{ marginLeft: "10px", float: 'left' }}>In Progress</h3>
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
          <h3 style={{ marginLeft: "10px", float: 'left' }}>Done</h3>
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
