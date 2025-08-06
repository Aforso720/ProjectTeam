import React, { useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-flip";
import { Navigation } from "swiper/modules";
import Event from "./Event";
import useMyEvents from "../API/useMyEvents";
import useEvent from "../API/useEvent";
import { AuthContext } from "../context/AuthContext";
import Loader from "../Component/Loader";

const Slider = ({ eventCategory }) => {
  const {user} = useContext(AuthContext)
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
  const { events, loading } = useEvent({ eventStatus});
  const { myEvents: myEventsData, loading: myEventsLoading } = useMyEvents({user});

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
          ? <Loader/>
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
