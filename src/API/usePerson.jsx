import React from 'react'
import axios from 'axios'

const usePerson = () => {
const [person , setPerson]= React.useState([]);

React.useEffect(()=>{
  const fetchData = async () => {
    try{
      const response = await axios.get("https://67a0c3ee5bcfff4fabe088e3.mockapi.io/person")
      setPerson(response.data)
      console.log(response)
    }catch(error){
      console.log("Произошла ошибка:" + error)
    }
  }
  fetchData();
},[])

  return person;
}

export default usePerson;