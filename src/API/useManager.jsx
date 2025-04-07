import React from 'react';
import axios from 'axios';

const useManager = () => {
    const [manager, setManager] = React.useState([]);
    const [isloading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const res = await axios.get("http://localhost:5555/api/users");
                const response = res.data;

                // Фильтруем админов
                const admins = response.data.filter(item => item.is_admin === true);

                // Находим главного админа с id = 11
                const mainAdmin = admins.find(item => item.id === 11);

                // Если главный админ есть, добавляем его в начало списка
                const adminsWithMain = mainAdmin ? [mainAdmin, ...admins.filter(admin => admin.id !== 11)] : admins;

                // Берем первые три админа (включая главного, если он есть)
                const firstThreeAdmins = adminsWithMain.slice(0, 3);

                // Добавляем поле status и дополнительный атрибут к объекту с id = 10
                const updatedAdmins = firstThreeAdmins.map(admin => {
                    // Добавляем статус
                    const status = admin.id === 11 ? "главный админ" : "секретарь";

                    // Добавляем дополнительный атрибут, если id = 10
                    const newAdmin = { ...admin, status };
                    if (admin.id === 10) {
                        newAdmin.newAttribute = 'Новое значение';
                    }

                    return newAdmin;
                });

                setManager(updatedAdmins);
            } catch (error) {
                console.log("Произошла ошибка:" + error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    return { manager, isloading };
};

export default useManager;