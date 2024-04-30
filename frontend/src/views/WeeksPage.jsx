// WeeksSection.jsx
import React, { useEffect, useState } from "react";

const WeeksSection = ({ onDaySelect }) => {
  const [currentWeekDates, setCurrentWeekDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    setCurrentWeekDates(getCurrentWeekDates());
  }, []);

  const getCurrentWeekDates = () => {
    const today = new Date();
    const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const currentWeekDates = [...Array(7)].map((_, index) => {
      const day = new Date(firstDayOfWeek);
      day.setDate(firstDayOfWeek.getDate() + index);
      return day;
    });
    return currentWeekDates;
  };

  const handleNextWeek = () => {
    const nextWeekDates = currentWeekDates.map((date) => {
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 7);
      return nextDate;
    });
    setCurrentWeekDates(nextWeekDates);
  };

  const handlePrevWeek = () => {
    const prevWeekDates = currentWeekDates.map((date) => {
      const prevDate = new Date(date);
      prevDate.setDate(prevDate.getDate() - 7);
      return prevDate;
    });
    setCurrentWeekDates(prevWeekDates);
  };

  const handleDaySelect = (date) => {
    setSelectedDate(date);
    onDaySelect(date); // Pass selected date to parent component
  };

  return (
    <div className="weeks-section">
      <h2>Weeks</h2>
      <button onClick={handlePrevWeek}>Previous Week</button>
      <button onClick={handleNextWeek}>Next Week</button>
      <div className="week-cards">
        {currentWeekDates.map((date, index) => (
          <div
            key={index}
            className={`week-card ${selectedDate === date ? 'selected' : ''}`}
            onClick={() => handleDaySelect(date)}
          >
            <div className="day-name">
              {date.toLocaleDateString("en-US", { weekday: "long" })}
            </div>
            <div className="date">
              {date.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeksSection;
