import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import axios from "axios";

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/contests");
        const contests = response.data.map((contest) => ({
          title: contest.name,
          start: contest.start_time,
          end: contest.end_time,
        }));
        setEvents(contests);
      } catch (error) {
        console.error("Error fetching contests:", error);
      }
    };

    fetchContests();
  }, []);

  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      events={events}
    />
  );
};

export default CalendarComponent;
