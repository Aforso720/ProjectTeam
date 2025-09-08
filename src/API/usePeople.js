import { useQuery } from "@tanstack/react-query";
import axiosInstance from "./axiosInstance";

const fetchPeople = async () => {
  const res = await axiosInstance.get("/users?per_page=100");
  const response = res.data;

  const sortedData = response.data
    .sort((a, b) => b.rating - a.rating)
    .map((item, index) => ({
      ...item,
      position: index + 1,
    }));

  return sortedData;
};

const usePeople = () => {
  const {
    data: person = [],
    isLoading: isLoadingTop,
    isError,
    error,
  } = useQuery({
    queryKey: ["people"],
    queryFn: fetchPeople,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  return { person, isLoadingTop, isError, error };
};

export default usePeople;
