import React from 'react'
import axiosInstance from './axiosInstance';

const useMyEvents = ({ user }) => {
  const [myEvents , setMyEvents] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(()=>{
    const fetchData = async () =>{
        try{
          setLoading(true); 
           const response = await axiosInstance.get(`/projects/by-user?user_id=${user.id}`);
          setMyEvents(response.data.data)
        }catch(error){
            // console.log("Произошла ошибка:" + error);
        }finally{
          setLoading(false)
        }
    }
    fetchData()
  },[])


  return {myEvents,loading}
}

export default useMyEvents