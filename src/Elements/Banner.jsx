import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-flip";
import { Navigation } from "swiper/modules";

const Banner = ({ news }) => {
    return (
        <div style={{ width: "100%", overflow: "hidden" }}>
            <Swiper
                modules={[Navigation]}
                spaceBetween={20}
                slidesPerView={1.5} // Значение по умолчанию
                navigation
                centeredSlides={true}
                effect={"flip"}
                loop={true}
                breakpoints={{
                    // Адаптация для экранов до 800px
                    800: {
                        slidesPerView: 1.5,
                        spaceBetween: 10,
                    },
                    // Адаптация для экранов от 800px до 1400px
                    1000: {
                        slidesPerView: 1.5, // Указываем явно
                        spaceBetween: 15,
                    },
                    // Адаптация для экранов от 1400px
                    1400: {
                        slidesPerView: 1.5,
                        spaceBetween: 20,
                    },
                    // Адаптация для экранов от 1800px
                    1800: {
                        slidesPerView: 1.5,
                        spaceBetween: 30,
                    },
                    // Адаптация для экранов от 2000px
                    2000: {
                        slidesPerView: 2.5,
                        spaceBetween: 50,
                    },
                }}
            >
                {news.map((item) => (
                    <SwiperSlide key={item.key}>
                        <img
                            src={item.image}
                            alt="Slide 1"
                            style={{ width: "100%", borderRadius: "10px" }}
                            className="BannerImg"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default Banner;