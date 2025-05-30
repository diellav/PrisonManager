import React, { useEffect, useState } from "react";
import axiosInstance from "./axios";

const UserScheduleList = ({ userID }) => {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await axiosInstance.get(`/staff_schedule/users/${userID}`);
        console.log('Schedules data:', response.data); 
        console.log('userID:', userID);
        setSchedules(response.data);
      } catch (error) {
        console.error("Failed to fetch schedules:", error);
      }
    };
    if (userID) {
      fetchSchedules();
    }
  }, [userID]);

  if (!schedules.length) return <p>No schedules for upcoming days.</p>;

  return (
    <div>
      <h4>Your Upcoming Schedules</h4>
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Shift Type</th>
            <th>Start Time</th>
            <th>End Time</th>
          </tr>
        </thead>
       <tbody>
  {schedules.map((schedule) => (
    <tr key={schedule.staff_schedule_ID}>
      <td>{schedule.date_ ? schedule.date_.split("T")[0] : "N/A"}</td>
      <td>{schedule.shift_type}</td>
      <td>
        {schedule.shift_start
          ? new Date(schedule.shift_start).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "N/A"}
      </td>
      <td>
        {schedule.shift_end
          ? new Date(schedule.shift_end).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "N/A"}
      </td>
    </tr>
  ))}
</tbody>
      </table>
    </div>
  );
};

export default UserScheduleList;
