import React from 'react'
import axios from 'axios';

const useManager = () => {
    const [manager, setManager] = React.useState([]);
    const [isloading, setIsLoading] = React.useState(true);

    React.useEffect(()=>{
            const fetchData = async () => {
            try{
                setIsLoading(true)
                const response = await axios.get("https://67ac93e33f5a4e1477db15d4.mockapi.io/Person")

                const mainAdmin = response.data.find(item => item.status === "главный админ");
                const admins = response.data.filter(item => item.status === "админ").slice(0, 2);

                const filteredData = [mainAdmin, ...admins].filter(Boolean); 

                setManager(filteredData)
            }catch(error){
                console.log("Произошла ошибка:" + error);
            }finally{
                setIsLoading(false)
            }
        }
        fetchData()
    },[])

  return { manager , isloading}
}

export default useManager;