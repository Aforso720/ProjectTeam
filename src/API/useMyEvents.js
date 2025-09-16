import React from "react";
import axiosInstance from "./axiosInstance";

const useMyEvents = ({ user, page, perPage }) => {
  const [myEvents, setMyEvents] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [meta, setMeta] = React.useState({});

  const fetchData = React.useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/projects/by-user?user_id=${user.id}&page=${page}&per_page=${perPage}`
      );
      setMyEvents(response.data.data);
      setMeta(response.data.meta);
    } catch (error) {
      console.error("Ошибка загрузки проектов:", error);
    } finally {
      setLoading(false);
    }
  }, [page, perPage, user?.id]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { myEvents, setMyEvents, loading, meta, refresh: fetchData };
};

export default useMyEvents;
