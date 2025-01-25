import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-flip";
import { Navigation } from "swiper/modules";

const Banner = () => {
  return (
    <div style={{ width: "100%", overflow: "hidden" }}>
      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView={1.5}
        navigation
        centeredSlides={true}
        effect={"flip"}
        loop={true}
        breakpoints={{
          1800: {
            spaceBetween:30,
          },
          2000: {
            slidesPerView:2.5, 
            spaceBetween:50,
          },
        }}
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
