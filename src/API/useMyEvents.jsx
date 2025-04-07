import React from 'react'
import axios from 'axios'

const useMyEvents = () => {
  const [myEvents , setMyEvents] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(()=>{
    const fetchData = async () =>{
        try{
          setLoading(true); 
           const response = await axios.get('https://67b9c5be51192bd378de636d.mockapi.io/MyEvent')
           console.log(response.data)
           setMyEvents(response.data)
        }catch(error){
            console.log("Произошла ошибка:" + error);
        }finally{
          setLoading(false)
        }
    }
    fetchData()
  },[])


  return {myEvents,loading}
}

export default useMyEvents