// MonthsSection.jsx
import React, { useState, useEffect } from "react";
import TaskForm from "./TaskForm";

const MonthsSection = ({ onDaySelect }) => {
  const [currentWeekDays, setCurrentWeekDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

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
  }, []);

  const handleDaySelect = (date) => {
    setSelectedDate(date);
    onDaySelect(date); // Pass selected date to parent component
  };

  const handleNextWeek = () => {
    const nextWeekDays = currentWeekDays.map((date) => {
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 7);
      return nextDate;
    });
    setCurrentWeekDays(nextWeekDays);
  };

  const handlePrevWeek = () => {
    const prevWeekDays = currentWeekDays.map((date) => {
      const prevDate = new Date(date);
      prevDate.setDate(prevDate.getDate() - 7);
      return prevDate;
    });
    setCurrentWeekDays(prevWeekDays);
  };

  const weekNames = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <>
      <h2 style={{ marginTop: '10px', marginBottom: '5px'}}>Month Section</h2>
      <div className="months-section">
        <div className="week-names">
          {weekNames.map((name) => (
            <div key={name} className="week-name">
              {name}
            </div>
          ))}
        </div>
        <div className="week-slider">
          <button onClick={handlePrevWeek}>&lt;</button>
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
              {date.getDate()}-
              {date.toLocaleDateString("en-US", { month: "long" })},{" "}
              {date.getFullYear()} year
            </div>
          ))}
          <button onClick={handleNextWeek}>&gt;</button>
        </div>
        {selectedDate && (
          <div className="selected-day-form">
            <h3>
              Selected Day:{" "}
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </h3>
            <TaskForm selectedDate={selectedDate} />
          </div>
        )}
      </div>
    </>
  );
};

export default MonthsSection;
