import React from 'react'
import Slaider from '../Elements/Slaider'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-flip";
import { Navigation } from "swiper/modules";

const Contests = () => {
  return (
    <div className='Contests'>
        <div className='MyEvents'>
            <h2>Мои конкурсы</h2>
            <div className="SlaiderCont">
                <Slaider/>
            </div>
        </div>
        <div className='BannerCont'>
             <div className='bannerSlider' style={{ width: "100%", overflow: "hidden" }}>
                  <Swiper
                    modules={[Navigation]}
                    spaceBetween={200}
                    slidesPerView={1}
                    navigation
                    centeredSlides={true}
                    effect={"flip"}
                    loop={true}
                    breakpoints={{
                    //   1800: {
                    //     spaceBetween:30,
                    //   },
                    //   2000: {
                    //     slidesPerView:2.5, 
                    //     spaceBetween:50,
                    //   },
                    }}
                  >
                    <SwiperSlide>
                      <img
                        src="img\image 6.png"
                        alt="Slide 1"
                        style={{ width: "1334px", height: '590px', borderRadius: "10px" }}
                        className="BannerImg"
                      />
                    </SwiperSlide>
                    <SwiperSlide>
                      <img
                        src="img/image 4.svg"
                        alt="Slide 2"
                        style={{ width: "1334px", height: '590px', borderRadius: "10px" }}
                        className="BannerImg"
                      />
                    </SwiperSlide>
                  </Swiper>
                </div>
        </div>  
        <div className='EventsCont'>
        <ul className='statesCont'>
                <li className='stateEvent activeCont'>Активные</li>
                <li className='stateEvent'>Завершенные</li>
                <li className='stateEvent'>Предстоящие</li>
        </ul>
        <div className='arrEvents'>
          <img
            src="img/image 1.png"
            alt="Slide 1"
            style={{ width: "400px", borderRadius: "10px" }}
            className="SlaiderImg"
          />
          <img
            src="img/image 1.png"
            alt="Slide 1"
            style={{ width: "400px", borderRadius: "10px" }}
            className="SlaiderImg"
          />
          <img
            src="img/image 1.png"
            alt="Slide 1"
            style={{ width: "400px", borderRadius: "10px" }}
            className="SlaiderImg"
          />
          <img
            src="img/image 1.png"
            alt="Slide 1"
            style={{ width: "400px", borderRadius: "10px" }}
            className="SlaiderImg"
          />
          <img
            src="img/image 1.png"
            alt="Slide 1"
            style={{ width: "400px", borderRadius: "10px" }}
            className="SlaiderImg"
          />
          <img
            src="img/image 1.png"
            alt="Slide 1"
            style={{ width: "400px", borderRadius: "10px" }}
            className="SlaiderImg"
          />
          <img
            src="img/image 1.png"
            alt="Slide 1"
            style={{ width: "400px", borderRadius: "10px" }}
            className="SlaiderImg"
          />
          <img
            src="img/image 1.png"
            alt="Slide 1"
            style={{ width: "400px", borderRadius: "10px" }}
            className="SlaiderImg"
          />
          <img
            src="img/image 1.png"
            alt="Slide 1"
            style={{ width: "400px", borderRadius: "10px" }}
            className="SlaiderImg"
          />
        </div>
        <ul className='paginationEvents'>
          <li>Н</li>
          <li>1</li>
          <li>2</li>
          <li>3</li>
          <li>Д</li>
        </ul>
        </div>
    </div>
  )
}

export default Contests;