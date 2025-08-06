import axiosInstance from "./axiosInstance";
import React from "react";

const useEvent = ({ status }) => {
  const [events, setEvents] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/events?per_page=100");

        const eventsData = response.data?.data || response.data;

        if (!Array.isArray(eventsData)) {
          throw new Error("Данные не являются массивом");
        }

        const filteredEvents = status === 'active'
            ? eventsData.filter((event) => event.status === 'active') 
            : eventsData.filter((event) => event.status === 'completed');

        setEvents(filteredEvents);
      } catch (error) {
        console.error("Ошибка при загрузке событий:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [status]);

  return { events, loading };
};

export default useEvent;
