import React from "react";
import useManager from "../../../API/useManager";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Loader from "../../../Component/Loader";

const SlaiderMobilVersHome = () => {
  const { manager , isloading:isloadingMng } = useManager();
  return (
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
                <img src="img/kot.webp" loading="lazy" alt="" />
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
  );
};

export default SlaiderMobilVersHome;
