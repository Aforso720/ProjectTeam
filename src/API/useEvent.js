import axios from "axios";
import React from "react";

const useEvent = ({ eventStatus, authToken }) => {
  const [events, setEvents] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5555/api/events?per_page=100", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        const eventsData = response.data?.data || response.data;

        if (!Array.isArray(eventsData)) {
          throw new Error("Данные не являются массивом");
        }

        const filteredEvents = eventStatus
            ? eventsData 
            : eventsData.filter((event) => event.status === eventStatus);

        setEvents(filteredEvents);
      } catch (error) {
        console.error("Ошибка при загрузке событий:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventStatus, authToken]);

  return { events, loading };
};

export default useEvent;
