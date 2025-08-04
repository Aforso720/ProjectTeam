import React from 'react'
import axios from 'axios'

const useMyEvents = ({authToken , user }) => {
  const [myEvents , setMyEvents] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  // console.log(user)

  React.useEffect(()=>{
    const fetchData = async () =>{
        try{
          setLoading(true); 
           const response = await axios.get(`http://localhost:5555/api/projects/by-user?user_id=${user.id}`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                });
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