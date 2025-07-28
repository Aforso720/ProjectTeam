import React from 'react'
import axios from 'axios'

const useMyEvents = ({authToken}) => {
  const [myEvents , setMyEvents] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(()=>{
    const fetchData = async () =>{
        try{
          setLoading(true); 
           const response = await axios.get("http://localhost:5555/api/projects/by-user?user_id=11", {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                });
          setMyEvents(response.data.data)
        }catch(error){
            console.log("Произошла ошибка:" + error);
        }finally{
          setLoading(false)
        }
    }
    fetchData()
  },[])
          console.log(myEvents)


  return {myEvents,loading}
}

export default useMyEvents