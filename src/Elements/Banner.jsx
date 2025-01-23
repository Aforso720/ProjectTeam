import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-flip";
import { Navigation } from "swiper/modules";

const Banner = () => {
  return (
    <div style={{ width: "100vw", overflow: "hidden" }}>
      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView={1.5}
        navigation
        pagination={{
          clickable: true,
          renderBullet: (index, className) => `<span class="${className}"></span>`,
        }}
        centeredSlides={true}
        effect={"flip"}
        loop={true}
      >
        <SwiperSlide>
          <img
            src="img/image 4.svg"
            alt="Slide 1"
            style={{ width: "100%", borderRadius: "10px" }}
            className="BannerImg"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src="img/image 4.svg"
            alt="Slide 2"
            style={{ width: "100%", borderRadius: "10px" }}
            className="BannerImg"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src="img/image 4.svg"
            alt="Slide 3"
            style={{ width: "100%", borderRadius: "10px" }}
            className="BannerImg"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src="img/image 4.svg"
            alt="Slide 4"
            style={{ width: "100%", borderRadius: "10px" }}
            className="BannerImg"
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Banner;
