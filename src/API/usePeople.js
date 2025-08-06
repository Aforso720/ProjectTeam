import React from 'react';
import axiosInstance from './axiosInstance';

const usePeople = () => {
    const [person, setPerson] = React.useState([]);
    const [isLoadingTop, setIsLoadingTop] = React.useState(true);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoadingTop(true);
                const res = await axiosInstance.get("/users?per_page=100");
                
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
        fetchData()
    }, []);
    
    return { person, isLoadingTop };
};

export default usePeople;