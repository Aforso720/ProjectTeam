import React, { useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-flip";
import { Navigation } from "swiper/modules";
import Event from "./Event";
import useAllMyEvents from "../API/useAllMyEvent";
import useEvent from "../API/useEvent";
import { AuthContext } from "../context/AuthContext";
import Loader from "../Component/Loader";

const Slider = ({ eventCategory }) => {
  const { user } = useContext(AuthContext);

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
  const isMyProject = eventStatus === "myProject";

  const { events, loading: eventsLoading } = useEvent({ status: eventStatus });
  const { myEvents: myEventsData, loading: myEventsLoading } = useAllMyEvents({
    user: isMyProject && user ? user : null,
  });

  const dataToShow = isMyProject ? myEventsData : events;
  const isLoading = isMyProject ? myEventsLoading : eventsLoading;

  if (isLoading) return <Loader />;

  if (!dataToShow || dataToShow.length === 0) {
    return <p style={{ padding: "1rem" }}>Нет доступных конкурсов.</p>;
  }

  // Минимальное количество для слайдера на десктопе
  const minSlidesDesktop = 3;

  if (dataToShow.length <= minSlidesDesktop) {
    return (
      <div className="events-grid" style={{ display: "flex", gap: "1rem" }}>
        {dataToShow.map((item) => (
          <Event
            key={item.id}
            id={item.id}
            image={item.preview_image}
            description={isMyProject ? item.name : item.title}
            homeEvent="homeEvents"
            contMyEvent="contMyEventMob"
          />
        ))}
      </div>
    );
  }

  return (
    <Swiper
      modules={[Navigation]}
      spaceBetween={30}
      slidesPerView={3}
      navigation
      effect={"flip"}
      initialSlide={1}
      breakpoints={{
        1400: { spaceBetween: 30, slidesPerView: 3 },
        800: { spaceBetween: 5, slidesPerView: 2 },
        375: { spaceBetween: 10, slidesPerView: 1 },
      }}
    >
      {dataToShow.map((item) => (
        <SwiperSlide key={item.id}>
          <Event
            id={item.id}
            image={item.preview_image}
            description={isMyProject ? item.name : item.title}
            homeEvent="homeEvents"
            contMyEvent="contMyEventMob"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Slider;
