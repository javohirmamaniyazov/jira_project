import React, { useState } from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

const TaskModal = ({ isOpen, onRequestClose, onCreateTask }) => {
  const [content, setContent] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10)); // Initial date set to today

  const handleSubmit = (e) => {
    e.preventDefault();
    const task = {
      content,
      date,
      status: "created",
    };
    onCreateTask(task);
    resetForm();
  };

  const resetForm = () => {
    setContent("");
    setDate(new Date().toISOString().slice(0, 10)); // Reset date to today
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
          Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="modal-input"
          />
        </label>
        <button type="submit" className="modal-button">
          Create Task
        </button>
      </form>
    </Modal>
  );
};

export default TaskModal;
