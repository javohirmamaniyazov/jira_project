// TaskModal.jsx
import React, { useState } from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

const TaskModal = ({ isOpen, onRequestClose, onCreateTask }) => {
  // Get current date information
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  // Generate array of years for the previous 50 years, current year, and next 50 years
  const years = Array.from({ length: 101 }, (_, index) =>
    (currentYear - 50 + index).toString()
  );

  // Array of month names
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Initialize state
  const [content, setContent] = useState("");
  const [year, setYear] = useState(currentYear.toString());
  const [month, setMonth] = useState((currentDate.getMonth() + 1).toString());
  const [day, setDay] = useState(currentDate.getDate().toString());

  const handleSubmit = (e) => {
    e.preventDefault();
    const date = new Date(year, month - 1, day);
    const task = {
      content,
      date,
      status: "created", 
    };
    onCreateTask(task);
    setContent("");
    setYear(currentYear.toString());
    setMonth((currentDate.getMonth() + 1).toString());
    setDay(currentDate.getDate().toString());
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <h2>Create Task</h2>
      <form onSubmit={handleSubmit}>
        <label className="modal-label">
          Content:
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="modal-input"
          />
        </label>
        <label className="modal-label">
          Year:
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="modal-select"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>
        <label className="modal-label">
          Month:
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="modal-select"
          >
            {months.map((month, index) => (
              <option key={index + 1} value={index + 1}>
                {month}
              </option>
            ))}
          </select>
        </label>
        <label className="modal-label">
          Day:
          <select
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="modal-select"
          >
            {Array.from({ length: 31 }, (_, index) => (
              <option key={index + 1} value={index + 1}>
                {index + 1}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="modal-button">
          Create Task
        </button>
      </form>
    </Modal>
  );
};

export default TaskModal;
