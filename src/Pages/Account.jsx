import React from 'react'
import Profile from '../Elements/Profile';
import MyEvents from '../Elements/MyEvents'
import MyDocument from '../Elements/MyDocument';
import { useNavigate } from 'react-router-dom';

const Account = ({handleLogoutAuth}) => {
    const [activeTab, setActiveTab] = React.useState("personalData");
    const navigate = useNavigate();
    const handleLogout = () => {
        handleLogoutAuth(); 
        navigate('/'); 
    };
    return (
        <section className='Account'>
            <ul className='navigation_account'>
                <li
                    className={activeTab === "personalData" ? 'activeAcc' : ""}
                    onClick={() => setActiveTab("personalData")}
                >
                    Профиль
                </li>
                <li
                    className={activeTab === "MyEvents" ? 'activeAcc' : ""}
                    onClick={() => setActiveTab("MyEvents")}
                >
                    Проекты
                </li>
                <li
                    className={activeTab === "MyDocument" ? 'activeAcc' : ""}
                    onClick={() => setActiveTab("MyDocument")}
                >
                    Сертификаты
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
        </section>
    )
}

export default Account