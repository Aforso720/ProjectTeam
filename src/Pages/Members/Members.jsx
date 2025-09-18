import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Loader from "../../Component/Loader";
import usePeople from "../../API/usePeople";
import useManager from "../../API/useManager";
import "./Members.scss";
import Seo from "../../components/Seo/Seo";

const Members = () => {
  const { person: topPerson, isLoadingTop } = usePeople();
  const { manager, isloading: isloadingMng } = useManager();
  const formatName = (fullName) => {
    const maxLength = 12;
    if (fullName.length <= maxLength) {
      return fullName;
    }

    const parts = fullName.split(" ");
    if (parts.length < 2) {
      return fullName;
    }

    const lastName = parts[0];
    const firstName = parts[1][0] + ".";
    const middleName = parts[2] ? parts[2][0] + "." : "";

    return `${lastName} ${firstName} ${middleName}`.trim();
  };

  return (
    <>
      <Seo
        title="Участники Project Team — руководители и лидеры рейтинга"
        description="Познакомьтесь с руководителями Project Team и лидерами студенческого рейтинга. Найдите контакты и роли участников команды."
        canonicalPath="/members"
        ogTitle="Участники Project Team"
        ogDescription="Руководители и активные участники Project Team GGNTU на одной странице."
        ogImage="/img/DefaultImage.webp"
        ogImageAlt="Участники Project Team"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Участники Project Team",
          url: "https://project-team.site/members",
          description:
            "Руководители и участники Project Team GGNTU с информацией о статусе и достижениях.",
        }}
      />
      <section className="Members">
        <section className="supervisor">
          <h2>Руководители</h2>
          <ul className="cardSupervisor">
            {isloadingMng ? (
              <Loader />
            ) : (
              manager.map((item) => (
                <li key={item.key}>
                  <img src="img/kot.jpg" alt={item.first_name} />
                  <h4>{item.first_name}</h4>
                  {item.status === "главный админ" ? (
                    <p>Руководитель проектной команды</p>
                  ) : (
                    <p>Секретарь</p>
                  )}
                </li>
              ))
            )}
          </ul>

          <Swiper
            className="mobSlaidMemb"
            modules={[Navigation]}
            spaceBetween={10}
            slidesPerView={1}
            navigation={true}
          >
            {isloadingMng
              ? Array.from({ length: 3 }).map((_, index) => (
                  <SwiperSlide key={index}>Загрузка...</SwiperSlide>
                ))
              : manager.map((item, index) => (
                  <SwiperSlide key={item.key || index}>
                    <div className="card_manager">
                      <img src="img/kot.jpg" alt={item.first_name} />
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
        </section>
        <section className="rating">
          <h2>Лидеры рейтинга</h2>
          <ul>
            {isLoadingTop ? (
              <Loader />
            ) : (
              topPerson.map((item, index) => (
                <li
                  className={`cardRating ${index >= 3 ? "cardWithButton" : ""}`}
                  key={index}
                >
                  {index === 0 && (
                    <img src="/img/crown.png" className="KingTop" alt="Корона лидера рейтинга" />
                  )}
                  <img className="imgRating" alt={`Участник ${item.first_name}`} src="img/kot.jpg" />
                  <div className="textCard">
                    <p className="positionRating">
                      <b>{item.position}</b>st
                    </p>
                    <div className="textInfo">
                      <p className="textName">
                        {index < 3 ? formatName(item.first_name) : item.first_name}
                      </p>
                      <p className="textGroup">ПИ-22-1</p>
                    </div>
                    <span className="numRating">{item.rating}</span>
                  </div>
                </li>
              ))
            )}
          </ul>
        </section>
      </section>
    </>
  );
};

export default Members;
