// TaskForm.jsx
import React, { useState } from "react";
import axiosClient from "../../ApiConnection/axiosClient";

const TaskForm = ({ selectedDate }) => {
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    // Create task API request
    axiosClient.post(
      "/tasks",
      { content, date: selectedDate.toISOString().slice(0, 10), status: "created" }
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
