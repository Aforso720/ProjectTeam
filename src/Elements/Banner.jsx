import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useNavigate } from "react-router";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-flip";
import { Navigation } from "swiper/modules";

const Banner = ({ news }) => {
    const navigate = useNavigate();

    const handleSlideClick = (eventId) => {
        navigate(`/events/${eventId}`);
    };

    return (
        <div style={{ width: "1440px", overflow: "hidden" , height:'100%' }}>
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
                        style={{ cursor: "pointer"  }}
                    >
                        <img
                            src={ item.image === null  ? item.image : '/img/image2.png'}
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