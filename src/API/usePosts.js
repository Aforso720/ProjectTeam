import { useQuery } from "@tanstack/react-query";
import axiosInstance from "./axiosInstance";

const fetchPosts = async () => {
  const res = await axiosInstance.get("/news?per_page=100");
  return res.data.data;
};

const usePosts = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    staleTime: 1000 * 60 * 5,    
    cacheTime: 1000 * 60 * 10,   
    refetchOnWindowFocus: false, 
  });
};

export default usePosts;