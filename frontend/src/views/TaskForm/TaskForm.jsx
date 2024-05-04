import React, { useState, useEffect } from "react";
import axiosClient from "../../ApiConnection/axiosClient";

const TaskForm = ({ selectedDate }) => {
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosClient.get("/user");
        setUserId(response.data.id); // Set the user ID
      } catch (error) {
        // Handle error here
      }
    };

    fetchUser(); // Fetch user information when the component mounts
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    // Create task API request
    axiosClient.post(
      "/tasks",
      { content, date: selectedDate.toISOString().slice(0, 10), status: "created", user_id: userId } // Include the user ID
    )
    .then((response) => {
      // console.log("Task added successfully:", response.data);
      // Clear form after successful submission
      setContent("");
    })
    .catch((error) => {
      console.error("Error adding task:", error);
    });
  };

  return (
    <div className="task-form">
      <h2>Create Task for {selectedDate.toLocaleDateString("en-GB", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</h2>
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
  );
};

export default TaskForm;
