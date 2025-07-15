import React from 'react';
import axios from 'axios';

const usePeople = ({ authToken } = {}) => {
    const [person, setPerson] = React.useState([]);
    const [isLoadingTop, setIsLoadingTop] = React.useState(true);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoadingTop(true);
                const res = await axios.get("http://localhost:5555/api/users", {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                });
                
                const response = res.data;
                const sortedData = response.data
                    .sort((a, b) => b.rating - a.rating)
                    .map((item, index) => ({
                        ...item,
                        position: index + 1
                    }));

                setPerson(sortedData);
            } catch (error) {
                console.log("Произошла ошибка:", error);
            } finally {
                setIsLoadingTop(false);
            }
        };
        
        if (authToken) {
            fetchData();
        }
    }, [authToken]);
    
    return { person, isLoadingTop };
};

export default usePeople;