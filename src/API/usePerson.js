import { useQuery } from "@tanstack/react-query";
import axiosInstance from "./axiosInstance";

const fetchPerson = async (amount) => {
  const res = await axiosInstance.get("/users?per_page=100");
  const response = res.data;

  let sortedData = response.data
    .sort((a, b) => b.rating - a.rating)
    .map((item, index) => ({
      ...item,
      position: index + 1,
    }));

  return amount ? sortedData.slice(0, amount) : sortedData;
};

const usePerson = ({ amount } = {}) => {
  const {
    data: person = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["person", amount], // ключ зависит от amount, чтобы кэш был разный
    queryFn: () => fetchPerson(amount),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  return { person, isLoading, isError, error };
};

export default usePerson;
