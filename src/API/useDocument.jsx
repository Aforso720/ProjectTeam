// useDocument.js
import React from 'react';
import axios from 'axios';

const useDocument = () => {
    const [myDocument, setMyDocument] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get('https://67b9c5be51192bd378de636d.mockapi.io/MyDocument');
            setMyDocument(response.data);
        } catch (error) {
            console.log("Произошла ошибка:" + error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchData();
    }, []);

    return { myDocument, loading, fetchData };
};

export default useDocument;