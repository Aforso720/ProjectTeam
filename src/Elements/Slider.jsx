import React from "react";
import {Swiper, SwiperSlide} from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-flip";
import {Navigation} from "swiper/modules";
import Event from "./Event";
import {MyContext} from "../App";

const Slider = () => {
    const {events} = React.useContext(MyContext);

    // После того как добавил запросы в слайдер он перестал отвечать на стрелки в начале , потом исправлю

    if (!events) {
        return <div>Loading...</div>;
    }

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
                {events.map(item => (
                    <SwiperSlide key={item.id}>
                        <Event image={item.image} description={item.description}/>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default Slider;