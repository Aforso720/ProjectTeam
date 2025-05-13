import React from 'react'
import Profile from '../Elements/Profile';
import MyEvents from '../Elements/MyEvents'
import MyDocument from '../Elements/MyDocument';
import { useNavigate } from 'react-router-dom';

const Account = ({setUserActive}) => {
    const [activeTab, setActiveTab] = React.useState("personalData");
    const navigate = useNavigate();

    const handleLogout = () => {
        setUserActive(false); 
        navigate('/'); 
    };

    return (

        <div className='Account'>
            <ul className='navigation_account'>
                <li
                    className={activeTab === "personalData" ? 'activeAcc' : ""}
                    onClick={() => setActiveTab("personalData")}
                >
                    Личные данные
                </li>
                <li
                    className={activeTab === "MyEvents" ? 'activeAcc' : ""}
                    onClick={() => setActiveTab("MyEvents")}
                >
                    Мои проекты
                </li>
                <li
                    className={activeTab === "MyDocument" ? 'activeAcc' : ""}
                    onClick={() => setActiveTab("MyDocument")}
                >
                    Мои сертификаты
                </li>
                <li
                    className={activeTab === "LogOut" ? 'activeAcc' : ""}
                    onClick={() => setActiveTab("LogOut")}
                >
                    Выход
                </li>
            </ul>

            {activeTab === "personalData" ? (
                <Profile/>
            ) : null}

            {activeTab === "MyEvents" ? (
                <MyEvents/>
            ) : null}

            {activeTab === "MyDocument" ? (
                <MyDocument/>
            ) : null}

            {activeTab === "LogOut" ? (
                handleLogout()
            ) : null}


        </div>
    )
}

export default Account