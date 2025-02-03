import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-flip";
import { Navigation } from "swiper/modules";

const Slaider = () => {
  return (
    <div className="sliderContainer">
    <Swiper
      modules={[Navigation]}
      spaceBetween={30}
      slidesPerView={3}
      navigation
      centerInsufficientSlides={false}
      effect={"flip"}
      loop={true}
    >
      <SwiperSlide>
        <div className="swiperSlide">
          <img
            src="img/image 1.png"
            alt="Slide 1"
            style={{ width: "400px", borderRadius: "10px" }}
            className="SlaiderImg"
          />
          <div className="textOverlay">
            <p>PROJECT TEAM ICEITP НА ФОРУМЕ В ПЯТИГОРСКЕ</p>
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="swiperSlide">
          <img
            src="img/image 1.png"
            alt="Slide 2"
            style={{ width: "400px", borderRadius: "10px" }}
            className="SlaiderImg"
          />
          <div className="textOverlay">
            <p>Текст для второго слайда</p>
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="swiperSlide">
          <img
            src="img/image 1.png"
            alt="Slide 3"
            style={{ width: "400px", borderRadius: "10px" }}
            className="SlaiderImg"
          />
          <div className="textOverlay">
            <p>Текст для третьего слайда</p>
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="swiperSlide">
          <img
            src="img/image 1.png"
            alt="Slide 4"
            style={{ width: "400px", borderRadius: "10px" }}
            className="SlaiderImg"
          />
          <div className="textOverlay">
            <p>Текст для четвертого слайда</p>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  </div>
  );
};

export default Slaider;