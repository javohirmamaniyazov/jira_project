import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, Outlet } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextprovider";
import { Link } from "react-router-dom";
import WeeksSection from "../views/WeeksPage";
import TaskForm from "../views/TaskForm";
import MonthsPage from "../views/MonthPage";
import TaskModal from "../views/TaskModal";

export default function DefaultLayout() {
  const { user, token, setUser, setToken } = useStateContext();
  const [content, setContent] = useState("");
  const [today, setToday] = useState("");
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCreateTask = (task) => {
    console.log("Creating task:", task);

    // Make API request to create task
    axiosClient
      .post("/tasks", { task })
      .then((response) => {
        console.log("Task created successfully:", response.data);
        // Close modal after task creation
        handleCloseModal();
      })
      .catch((error) => {
        console.error("Error creating task:", error);
      });
  };

  // Get today's date
  useEffect(() => {
    const date = new Date();
    const formattedDate = date.toISOString().slice(0, 10);
    setToday(formattedDate);
  }, []);

  // Fetch all tasks
  useEffect(() => {
    if (!token) return;

    axiosClient
      .get("tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
        setTasks([]);
      });
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
        console.error("Error logging out:", error);
      });
  };

  // Handle task submission
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
        console.log("Task added successfully:", response.data);
        setContent("");
        fetchTasks(); // Refetch tasks after adding a new task
      })
      .catch((error) => {
        console.error("Error adding task:", error);
      });
  };

  const handleDaySelect = (date) => {
    setSelectedDate(date);
    // Filter tasks based on the selected date
    const filteredTasks = tasks.filter(
      (task) => task.date === date.toISOString().slice(0, 10)
    );
    console.log("Tasks for selected date:", filteredTasks);
    // Update tasks state with filtered tasks
  };

  const selectedDayTasks = selectedDate
    ? tasks.filter(
        (task) => task.date === selectedDate.toISOString().slice(0, 10)
      )
    : [];

  // Handle status change
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
        console.log("Task status updated successfully:", response.data);
        fetchTasks(); // Refetch tasks after updating status
      })
      .catch((error) => {
        console.error("Error updating task status:", error);
      });
  };

  // Fetch tasks function
  const fetchTasks = () => {
    axiosClient
      .get("/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
        setTasks([]);
      });
  };

  // Redirect to login page if token is not available
  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <div id="defaultLayout">
      <div className="content">
        <header>
          <div>Header</div>
          <li>
            <Link to="/weeks">Weeks</Link>
          </li>
          <li>
            <Link to="/months">Months</Link>
          </li>
          <li>
            <button onClick={handleOpenModal}>Create Task</button>
            <TaskModal
              isOpen={isModalOpen}
              onRequestClose={handleCloseModal}
              onCreateTask={handleCreateTask}
            />
          </li>

          <div>
            {user.name}
            <a href="#" onClick={onLogout} className="btn-logout">
              {" "}
              Logout
            </a>
          </div>
        </header>
        <main>
          <div className="create-task">
            <h2>Create Today's Task</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Task content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <button type="submit">Add Task</button>
            </form>
          </div>
          <div className="task-list">
            <h2>Today's Tasks</h2>
            <ul>
              {tasks.map((task) => (
                <li key={task.id}>
                  {task.content} - {task.status}
                  <select
                    value={task.status}
                    onChange={(e) =>
                      handleChangeStatus(task.id, e.target.value)
                    }
                  >
                    <option value="created">Created</option>
                    <option value="in progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </li>
              ))}
            </ul>
          </div>
          <WeeksSection onDaySelect={handleDaySelect} />{" "}
          {/* Include Weeks section here */}
          <div className="selecting-section">
            <div className="selecting-buttons">
              <button onClick={() => handleDaySelect(new Date())}>Today</button>
              {/* Render buttons for other days as needed */}
            </div>
          </div>
          {selectedDate && (
            <>
              <div className="selected-day-tasks">
                <h2>
                  Tasks for{" "}
                  {selectedDate.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </h2>
                <ul>
                  {selectedDayTasks.map((task) => (
                    <li key={task.id}>
                      {task.content} - {task.status}
                    </li>
                  ))}
                </ul>
              </div>
              <TaskForm selectedDate={selectedDate} />
            </>
          )}
          <MonthsPage />
        </main>
      </div>
    </div>
  );
}
