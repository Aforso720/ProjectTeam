import { useQuery } from "@tanstack/react-query";
import axiosInstance from "./axiosInstance";

const fetchManagers = async () => {
  const res = await axiosInstance.get("/users?per_page=100");
  const response = res.data;

  // фильтруем админов
  const admins = response.data.filter((item) => item.is_admin === true);

  // находим главного админа
  const mainAdmin = admins.find((item) => item.id === 1);

  // главный админ идёт первым
  const adminsWithMain = mainAdmin
    ? [mainAdmin, ...admins.filter((admin) => admin.id !== 1)]
    : admins;

  // добавляем статус
  const updatedAdmins = adminsWithMain.map((admin) => {
    const status = admin.id === 1 ? "главный админ" : "секретарь";
    return { ...admin, status };
  });

  return updatedAdmins;
};

const useManager = () => {
  const {
    data: manager = [], // по умолчанию []
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["managers"],
    queryFn: fetchManagers,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  // ⚡ можно вернуть сразу удобный объект, чтобы в компонентах не вытаскивать data
  return { manager, isLoading, isError, error };
};

export default useManager;