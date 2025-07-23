import React, { useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-flip";
import { Navigation } from "swiper/modules";
import Event from "./Event";
import LoadEvent from "./Loading/loadingEvent";
import useEvent from "../API/useEvent";
import { MyContext } from "../App";

const Slider = ({ eventCategory }) => {
  const { authToken } = useContext(MyContext);

  const getEventStatus = (category) => {
    switch (category) {
      case "Активные конкурсы":
        return "active";
      case "Завершенные конкурсы":
        return "completed";
      case "Мои конкурсы":
        return "myProject"; 
      default:
        return null;
    }
  };

  const eventStatus = getEventStatus(eventCategory);
  const { events, loading } = useEvent({ eventStatus, authToken });

  return (
    <div className="sliderContainer">
      <Swiper
        modules={[Navigation]}
        spaceBetween={30}
        slidesPerView={3}
        navigation
        effect={"flip"}
        initialSlide={1}
        breakpoints={{
          1400: {
            spaceBetween: 30,
            slidesPerView: 3,
          },
          800: {
            spaceBetween: 5,
            slidesPerView: 2,
          },
          375: {
            spaceBetween: 10,
            slidesPerView: 1,
          },
        }}
      >
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <SwiperSlide key={index}>
                <LoadEvent width="400px" height="200px" />
              </SwiperSlide>
            ))
          : events.map((item) => (
              <SwiperSlide key={item.id}>
                <Event
                  id={item.id}
                  image={item.preview_image}
                  description={item.title}
                  homeEvent="homeEvents"
                  contMyEvent="contMyEventMob"
                />
              </SwiperSlide>
            ))}
      </Swiper>
    </div>
  );
};

export default Slider;
