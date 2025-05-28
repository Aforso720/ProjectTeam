import React from 'react';
import './Contests.scss'
import Slider from '../../Elements/Slider';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-flip";
import { Navigation } from "swiper/modules";
import Event from '../../Elements/Event';
import usePosts from '../../API/usePosts';
import LoadingEvent from '../../Elements/Loading/loadingEvent';
import { MyContext } from '../../App';



const Contests = () => {
  const [selectedCategory, setSelectedCategory] = React.useState("Завершенные конкурсы");
  const { events, loading } = usePosts(selectedCategory);
  const { events: news, loading: loadingNews } = usePosts();
  const {userActive} = React.useContext(MyContext)

const [isMobileView, setIsMobileView] = React.useState(false);

React.useEffect(() => {
  const handleResize = () => {
    setIsMobileView(window.innerWidth >= 375 && window.innerWidth <= 800);
  };

  handleResize(); // начальная проверка
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);


  const filteredEvents = events.filter(event => event.status === selectedCategory);

  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 9;

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEvents = filteredEvents.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const swiperRef = React.useRef(null);

  React.useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.update();
    }
  }, [news]);

  return (
    <div className='Contests'>
      {userActive ? (
        <div className='MyEvents'>
        <h2>Мои конкурсы</h2>
        <div className="slider_cont">
          <Slider eventCategory={'Мои конкурсы'} />
        </div>
      </div>
      ):''}
      <div className='BannerCont'>
        <div className='bannerSlider' style={{ width: "100%", overflow: "hidden" }}>
          <Swiper
            ref={swiperRef}
            key={news.length}
            modules={[Navigation]}
            spaceBetween={200}
            slidesPerView={1}
            navigation
            centeredSlides={true}
            effect={"flip"}
            loop={true}
          >
            {loadingNews ? (
              <LoadingEvent width="1300px" height="600px" />
            ) : (
              news.map((item, index) => (
                <SwiperSlide style={{ width: "1334px", height: '100%'}} key={index}>
                  <img
                    src={item.image}
                    alt={`Slide ${index + 1}`}
                    style={{ width: "100%", height: '100%', borderRadius: "10px" }}
                    className="BannerImg"
                  />
                </SwiperSlide>
              ))
            )}
          </Swiper>
        </div>
      </div>
      <div className='EventsCont'>
        <ul className='statesCont'>
          <li
            className={`stateEvent ${selectedCategory === "Активные конкурсы" ? "activeCont" : ""}`}
            onClick={() => handleCategoryClick("Активные конкурсы")}
          >
            <b>Активные</b>
          </li>
          <li
            className={`stateEvent ${selectedCategory === "Завершенные конкурсы" ? "activeCont" : ""}`}
            onClick={() => handleCategoryClick("Завершенные конкурсы")}
          >
            <b>Завершенные</b>
          </li>
          <li
            className={`stateEvent ${selectedCategory === "Предстоящие" ? "activeCont" : ""}`}
            onClick={() => handleCategoryClick("Предстоящие")}
          >
            <b>Предстоящие</b>
          </li>
        </ul>
        {loading ? (
  isMobileView ? (
    <Swiper
    ref={swiperRef}
      spaceBetween={20}
      slidesPerView={3}
      effect={"flip"}
      pagination={{ clickable: true }}
    >
      {Array.from({ length: 9 }).map((_, index) => (
        <SwiperSlide key={index}>
          <LoadingEvent width="40vw" height="250px" />
        </SwiperSlide>
      ))}
    </Swiper>
  ) : (
    <div className='arrEvents'>
      {Array.from({ length: 9 }).map((_, index) => (
        <LoadingEvent width="400px" height="250px" key={index} />
      ))}
    </div>
  )
) : currentEvents.length > 0 ? (
  isMobileView ? (
    <Swiper
    ref={swiperRef}
    modules={[Navigation]}
      navigation
      spaceBetween={20}
      slidesPerView={2}
      className='mobSlaiderCont'
    >
      {currentEvents.map(item => (
        <SwiperSlide key={item.id} >
          <Event image={item.image} description={item.description} />
        </SwiperSlide>
      ))}
    </Swiper>
  ) : (
    <div className='arrEvents'>
      {currentEvents.map(item => (
        <Event key={item.id} image={item.image} description={item.description} />
      ))}
    </div>
  )
) : (
  <div
  style={{
    width: '100%',
    maxWidth: '1250px',
    height: 'clamp(300px, 50vh, 800px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0 auto', 
    padding: '0 1rem', 
    boxSizing: 'border-box'
  }}
>
  <p
    style={{
      fontSize: 'clamp(1rem, 2.5vw, 2rem)',
      color: '#4B1218',
      fontWeight: 'bold',
      textAlign: 'center'
    }}
  >
    Нет мероприятий этой категории
  </p>
</div>

)}
    {currentEvents.length > 0 ?? (
      
      <ul className='paginationEvents'>
      <li onClick={handlePrevPage}>
        <img src='/img/arrow-circle-left.png' alt='arrow' />
      </li>

      {loading ? (
        <li
          key={1}
          onClick={() => handlePageClick(1)}
          className={currentPage === 1 ? 'active_page' : ''}
        >
          {1}
        </li>
      ) : (
        Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <li
            key={page}
            onClick={() => handlePageClick(page)}
            className={currentPage === page ? 'active_page' : ''}
          >
            {page}
          </li>
        ))
      )}
      <li onClick={handleNextPage}>
        <img src='/img/arrow-circle-left.png' alt='arrow' />
      </li>
    </ul>
    )}
      </div>
    </div>
  );
};

export default Contests;