import axios from 'axios';
import React from 'react';

const usePosts = () => {
    const [news, setNews] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true); 
                const res = await axios.get('http://localhost:5555/api/news?per_page=100');

                setNews(res.data.data);
            } catch (error) {
                console.log(`Произошла ошибка в новостях ${error}`);
            } finally {
                setLoading(false); 
            }
        };

        fetchData();
    }, []);

    return { news, loading };
};

export default usePosts;