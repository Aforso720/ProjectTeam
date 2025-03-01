import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-flip";
import { Navigation } from "swiper/modules";
import Event from "./Event";
import { MyContext } from "../App";
import LoadEvent from "./Loading/loadingEvent";

const Slider = ({ eventCategory }) => {
    const { events, loadingMyEvent } = React.useContext(MyContext);

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
                {loadingMyEvent ? (
                    Array.from({ length: 4 }).map((_, index) => (
                        <SwiperSlide key={index}>
                            <LoadEvent width = "400px" height = "200px" />
                        </SwiperSlide>
                    ))
                ) : (
                    Array.isArray(eventCategory) && eventCategory.length > 0 ? (
                        eventCategory.map(item => (
                            <SwiperSlide key={item.id}>
                                <Event image={item.image} description={item.description} />
                            </SwiperSlide>
                        ))
                    ) : (
                        events.map(item => (
                            <SwiperSlide key={item.id}>
                                <Event image={item.image} description={item.description} />
                            </SwiperSlide>
                        ))
                    )
                )}
            </Swiper>
        </div>
    );
};

export default Slider;