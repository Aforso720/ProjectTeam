import React from "react";
import "./Home.scss";
import Banner from "../../Elements/Banner";
import Card from "../../Elements/Card/index";
import Slider from "../../Elements/Slider";
import { MyContext } from "../../App";
import LoadingEvent from "../../Elements/Loading/loadingEvent";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const Home = () => {
  const [isActive, setIsActive] = React.useState("Активные конкурсы");
  const {
    userActive,
    news,
    loadingMyNews,
    homePerson,
    isloadingPersHome,
    manager,
    isloadingMng,
  } = React.useContext(MyContext);
  const handleClick = (category) => {
    setIsActive(category);
  };
  function sortManager(managerList) {
    const admins = managerList?.filter((m) => m.status === "главный админ");
    const others = managerList?.filter((m) => m.status !== "главный админ");
    return [...admins, ...others];
  }

  return (
    <section className="Home">
      <section className="Banner">
        {loadingMyNews ? (
          <LoadingEvent width="1000px" height="40vh" />
        ) : (
          <Banner news={news} />
        )}
      </section>
      <section className="Events">
        {userActive && (
          <div className="myContestsMobile">
            <div className="mobileHeader">Мои конкурсы</div>
            <div className="sliderMyContests">
              <Slider section="my-contests" />
            </div>
          </div>
        )}

        <ul className="stateEvents">
          <li
            className={`stateEvent ${
              isActive === "Активные конкурсы" ? "active" : ""
            }`}
            onClick={() => handleClick("Активные конкурсы")}
          >
            <span>Активные конкурсы</span>
          </li>
          {userActive && (
            <li
              className={`stateEvent myContestsDesktop ${
                isActive === "Мои конкурсы" ? "active" : ""
              }`}
              onClick={() => handleClick("Мои конкурсы")}
            >
              <span>Мои конкурсы</span>
            </li>
          )}
          <li
            className={`stateEvent ${
              isActive === "Завершенные конкурсы" ? "active" : ""
            }`}
            onClick={() => handleClick("Завершенные конкурсы")}
          >
            <span>Завершенные конкурсы</span>
          </li>
        </ul>
        <div className="sliderHome">
          <Slider eventCategory={isActive} />
        </div>
      </section>
      <section className="TopT">
        <h2>Лидеры рейтинга</h2>
        <ul className="CardTop">
          {isloadingPersHome
            ? Array.from({ length: 3 }).map((_, index) => (
                <li key={index}>
                  <LoadingEvent width="300px" height="250px" />
                </li>
              ))
            : homePerson.map((person) => (
                <li key={person.position}>
                  <Card
                    {...person}
                    extraClass={person.position === 1 ? "WinnerCard" : ""}
                  />
                  {person.position === 1 && (
                    <img
                      src="/img/crown.png"
                      className="KingTop"
                      alt="Корона"
                    />
                  )}
                </li>
              ))}
        </ul>
      </section>
      <section className="aboutHome">
        <div className="contentAbout">
          <div className="textAbout">
            <h3>О нас</h3>
            <p>
             Project Team — это команда активных и амбициозных студентов ГГНТУ, которые специализируются на подаче заявок на гранты, конкурсы и стартапы. Мы помогаем превращать идеи в реальные проекты, открывая новые возможности для студентов и университета.
            </p>
          </div>
          <img src="img/image 6.png" className="imgAbout" alt="" />
        </div>
      </section>
      <section className="manager">
        <h2>Руководители</h2>

        <ul className="manager__list">
          {isloadingMng
            ? Array.from({ length: 3 }).map((_, index) => (
                <li key = {index}>
                  <LoadingEvent width="350px" height="250px" />
                </li>
              ))
            : manager.map((item,index) => (
                <li key={index}>
                  <div className="card_manager">
                    <img src="img/kot.jpg" alt="" />
                    <h4>{item.first_name}</h4>
                    {item.status === "главный админ" ? (
                      <p>Руководитель проектной команды</p>
                    ) : (
                      <p>Секретарь</p>
                    )}
                  </div>
                </li>
              ))}
        </ul>

        <div className="manager__slider">
          <Swiper
            modules={[Navigation]}
            spaceBetween={10}
            slidesPerView={1}
            pagination={{ clickable: true }}
            navigation={true}
          >
            {isloadingMng
              ? Array.from({ length: 3 }).map((_, index) => (
                  <SwiperSlide key={index}>
                    <LoadingEvent width="350px" height="250px" />
                  </SwiperSlide>
                ))
              : sortManager(manager).map((item, index) => (
                  <SwiperSlide key={item.key || index}>
                    <div className="card_manager">
                      <img src="img/kot.jpg" alt="" />
                      <h4>{item.first_name}</h4>
                      {item.status === "главный админ" ? (
                        <p>Руководитель проектной команды</p>
                      ) : (
                        <p>Секретарь</p>
                      )}
                    </div>
                  </SwiperSlide>
                ))}
          </Swiper>
        </div>
      </section>
    </section>
  );
};

export default Home;
