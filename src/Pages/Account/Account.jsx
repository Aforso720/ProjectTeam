import React, { useState, useEffect } from "react";
import Profile from "../../Elements/Profile";
import MyEvents from "../../Elements/MyEvents";
import MyDocument from "../../Elements/MyDocument";
import Notisfaction from "../../Elements/Notisfaction";
import { useNavigate } from "react-router";
import { useNotifications } from "../../context/NotificationContext";
import "./Account.scss";
import Seo from "../../components/Seo/Seo";

const Account = ({ handleLogoutAuth }) => {
  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = localStorage.getItem("accountActiveTab");
    return savedTab || "personalData";
  });

  const navigate = useNavigate();
  const { resetNotifications } = useNotifications();

  useEffect(() => {
    localStorage.setItem("accountActiveTab", activeTab);
  }, [activeTab]);

  const handleLogout = () => {
    handleLogoutAuth();
    resetNotifications();
    navigate("/");
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <>
      <Seo
        title="Личный кабинет — Project Team"
        description="Управляйте профилем, проектами и сертификатами в личном кабинете Project Team."
        canonicalPath="/profile"
        ogTitle="Личный кабинет Project Team"
        ogDescription="Доступ к персональным данным и проектам доступен только авторизованным участникам."
        ogImage="/img/LogoFoot.webp"
        ogImageAlt="Личный кабинет Project Team"
        robots="noindex, nofollow"
      />
      <section className="Account">
        <nav>
          <ul className="navigation_account">
            <li
              className={activeTab === "personalData" ? "activeAcc" : ""}
              onClick={() => handleTabClick("personalData")}
            >
              Профиль
            </li>
            <li
              className={activeTab === "MyEvents" ? "activeAcc" : ""}
              onClick={() => handleTabClick("MyEvents")}
            >
              Проекты
            </li>
            <li
              className={activeTab === "MyDocument" ? "activeAcc" : ""}
              onClick={() => handleTabClick("MyDocument")}
            >
              Сертификаты
            </li>
            <li
              className={activeTab === "LogOut" ? "activeAcc" : ""}
              onClick={() => handleTabClick("LogOut")}
            >
              <img
                src="/img/icons8-alarm-50.png"
                alt="Уведомления"
                className="NotisfactionIcon"
              />
            </li>
          </ul>
        </nav>
        {activeTab === "personalData" ? (
          <Profile handleLogout={handleLogout} />
        ) : null}

        {activeTab === "MyEvents" ? <MyEvents /> : null}

        {activeTab === "MyDocument" ? <MyDocument /> : null}

        {activeTab === "LogOut" ? <Notisfaction /> : null}
      </section>
    </>
  );
};

export default Account;
