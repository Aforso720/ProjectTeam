import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useNavigate } from "react-router";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-flip";
import { Navigation } from "swiper/modules";
import { ContentContext } from "../context/ContentContext";

const Banner = () => {
  const { news } = React.useContext(ContentContext);
  console.log(news);
  const navigate = useNavigate();

  const handleSlideClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  return (
    <section style={{ width: "1440px", overflow: "hidden", height: "100%" }}>
      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView={1.5}
        navigation
        centeredSlides={true}
        effect={"flip"}
        loop={true}
        breakpoints={{
          800: {
            slidesPerView: 1.5,
            spaceBetween: 10,
          },
          1000: {
            slidesPerView: 1.5,
            spaceBetween: 15,
          },
          1400: {
            slidesPerView: 1.5,
            spaceBetween: 20,
          },
          1800: {
            slidesPerView: 1.5,
            spaceBetween: 30,
          },
          2000: {
            slidesPerView: 2.5,
            spaceBetween: 50,
          },
        }}
      >
        {news.map((item) => (
          <SwiperSlide
            key={item.id}
            onClick={() => handleSlideClick(item.id)}
            style={{ cursor: "pointer" }}
          >
            <img
              src={item.image ? item.image : "/img/image2.png"}
              alt="Слайд"
              width="1440"
              height="487"
              style={{ width: "100%", borderRadius: "10px" }}
              className="BannerImg"
              loading="eager"
              fetchpriority="high"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Banner;
