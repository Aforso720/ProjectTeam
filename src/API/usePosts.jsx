import axios from 'axios';
import React from 'react';

const usePosts = (category) => {
    const [events, setEvents] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    const getEventStatus = (startDate, endDate) => {
        const currentDate = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (currentDate >= start && currentDate <= end) {
            return "Активные конкурсы";
        } else if (currentDate > end) {
            return "Завершенные конкурсы";
        } else {
            return "Предстоящие";
        }
    };

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true); 
                const response = await axios.get('https://67a0c3ee5bcfff4fabe088e3.mockapi.io/EventsProject');

                const eventsWithStatus = response.data.map(event => ({
                    ...event,
                    status: getEventStatus(event.startDate, event.endDate)
                }));

                let filteredEvents;

                if (category === "Мои конкурсы") {
                    // Фильтруем события, где participants === 1
                    filteredEvents = eventsWithStatus.filter(event => event.participants === 1);
                } else if (category) {
                    // Фильтруем по статусу, если category не "Мои конкурсы"
                    filteredEvents = eventsWithStatus.filter(event => event.status === category);
                } else {
                    // Если category не указан, возвращаем все события
                    filteredEvents = eventsWithStatus;
                }

                setEvents(filteredEvents);
            } catch (error) {
                console.log(`Произошла ошибка ${error}`);
            } finally {
                setLoading(false); 
            }
        };

        fetchData();
    }, [category]);

    return { events, loading };
};

export default usePosts;