// useDocument.js
import React from 'react';
import axiosInstance from './axiosInstance';

const useDocument = () => {
    const [myDocument, setMyDocument] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/certificates');
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