import React from 'react'
import axios from 'axios'

//  Сделать фильтрацию

const usePerson = ({amount} = {}) => {
    const [person, setPerson] = React.useState([]);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("https://67ac93e33f5a4e1477db15d4.mockapi.io/Person")
                const filteredData = amount ? response.data.slice(0, amount) : response.data;
                setPerson(filteredData)
            } catch (error) {
                console.log("Произошла ошибка:" + error)
            }
        }
        fetchData();
    }, [amount])

    return person;
}

export default usePerson;