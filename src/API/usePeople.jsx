import React from 'react';
import axios from 'axios';

const usePeople = ({ amount } = {}) => {
    const [person, setPerson] = React.useState([]);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get("http://localhost:5555/api/ratings");
                const response = res.data;
                let sortedData = response.data.sort((a, b) => b.rating - a.rating); 
                
                sortedData = sortedData.map((item, index) => ({
                    ...item,
                    position: index + 1
                }));

                const filteredData = amount ? sortedData.slice(0, amount) : sortedData;
                setPerson(filteredData);
            } catch (error) {
                console.log("Произошла ошибка:" + error);
            }
        };
        fetchData();
    }, [amount]);

    return { person };
};

export default usePeople;