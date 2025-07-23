import React from 'react';
import axios from 'axios';

const usePerson = ({ amount, authToken } = {}) => {
    const [person, setPerson] = React.useState([]);
    const [isloading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                const res = await axios.get("http://localhost:5555/api/users", {
                    headers: {
                        Authorization: `Bearer ${authToken}`    
                    }
                });
                const response = res.data
                let sortedData = response.data.sort((a, b) => b.rating - a.rating); 
                                
                sortedData = sortedData.map((item, index) => ({
                    ...item,
                    position: index + 1
                }));

                const filteredData = amount ? sortedData.slice(0, amount) : sortedData;
                setPerson(filteredData);
            } catch (error) {
                console.log("Произошла ошибка:" + error);
            }finally{
                setIsLoading(false)
            }
        };
        fetchData();
    }, [amount, authToken]);
    return {person, isloading};
};

export default usePerson;