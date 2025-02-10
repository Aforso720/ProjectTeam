import axios from 'axios';
import React from 'react';

const usePosts = () => {
  const [ events , setEvents]=React.useState([]);

    React.useEffect(()=>{
    const fetchData = async () => {
      try{
       const response = await axios.get('https://67a0c3ee5bcfff4fabe088e3.mockapi.io/EventsProject');
       setEvents(response.data);
      }catch (error) {
        console.log(`Произощла ощибка ${error}`);
      } 
    };
    fetchData();
  },[])

  return events
}

export default usePosts;