import React from "react";
import axiosInstance from "./axiosInstance";

const useAllMyEvents = ({ user }) => {
  const [myEvents, setMyEvents] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `/projects/by-user?user_id=${user.id}&per_page=100`
        );
        setMyEvents(response.data.data);
      } catch (error) {
        console.error("Ошибка загрузки проектов:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  return { myEvents, loading};
};

export default useAllMyEvents;
