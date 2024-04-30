// ParentComponent.jsx
import React, { useState } from "react";
import TaskForm from "./TaskForm"; // Import the task creation form
import WeeksSection from "./WeeksSection";

const ParentComponent = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDaySelect = (date) => {
    setSelectedDate(date);
  };

  return (
    <div>
      <WeeksSection onDaySelect={handleDaySelect} />
      {selectedDate && (
        <TaskForm selectedDate={selectedDate} />
      )}
    </div>
  );
};

export default ParentComponent;
