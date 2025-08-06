import React from "react";
import "./Home.scss";
import { PersonContext } from "../../context/PersonContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Loader from "../../Component/Loader";
import ManagerList from "./components/ManagerList";
import EventsSectionHome from "./components/EventsSectionHome";
import BannerSectionHome from "./components/BannerSectionHome";
import TopTSectionHome from './components/TopTSectionHome'

const Home = () => {
  const {  manager, isloadingMng } = React.useContext(PersonContext);

  return (
    <section className="Home">
      <BannerSectionHome/>
      <EventsSectionHome/>
      <TopTSectionHome/>
      <section className="aboutHome">
        <div className="contentAbout">
          <div className="textAbout">
            <h3>О нас</h3>
            <p>
              Project Team — это команда активных и амбициозных студентов ГГНТУ,
              которые специализируются на подаче заявок на гранты, конкурсы и
              стартапы. Мы помогаем превращать идеи в реальные проекты, открывая
              новые возможности для студентов и университета.
            </p>
          </div>
          <img src="img/image 6.png" loading="lazy" className="imgAbout" alt="Фото Команды" />
        </div>
      </section>
      <section className="manager">
        <h2>Руководители</h2>
        <ManagerList />
        <div className="manager__slider">
          <Swiper
            modules={[Navigation]}
            spaceBetween={10}
            slidesPerView={1}
            pagination={{ clickable: true }}
            navigation={true}
          >
            {isloadingMng ? (
              <Loader />
            ) : (
              manager.map((item, index) => (
                <SwiperSlide key={item.key || index}>
                  <div className="card_manager">
                    <img src="img/kot.jpg" loading="lazy" alt="" />
                    <h4>{item.first_name}</h4>
                    {item.status === "главный админ" ? (
                      <p>Руководитель проектной команды</p>
                    ) : (
                      <p>Секретарь</p>
                    )}
                  </div>
                </SwiperSlide>
              ))
            )}
          </Swiper>
        </div>
      </section>
    </section>
  );
};

export default Home;
