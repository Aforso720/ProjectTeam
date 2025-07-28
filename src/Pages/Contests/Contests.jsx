import React from 'react';
import './Contests.scss';
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
import useEvent from '../../API/useEvent';
import { useNavigate } from 'react-router';

const Contests = () => {
  const [status, setSelectedStatus] = React.useState("active");
  const { userActive , authToken } = React.useContext(MyContext);
  const { events, loading } = useEvent({ status, authToken });
  const { news, loadingNewsloadingMyNews } = usePosts();

  const [isMobileView, setIsMobileView] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 9;

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth >= 375 && window.innerWidth <= 900);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalPages = Math.ceil(events.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEvents = events.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handlePageClick = (page) => setCurrentPage(page);

  const handleCategoryClick = (category) => {
    setSelectedStatus(category);
    setCurrentPage(1);
  };

  const swiperRef = React.useRef(null);
  
  React.useEffect(() => {
    swiperRef.current?.swiper?.update();
  }, [news]);

  const navigate = useNavigate();

  const handleSlideClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  return (
    <section className='Contests'>
      {userActive && (
        <div className='MyEvents'>
          <h2>Мои конкурсы</h2>
          <div className="slider_cont">
            <Slider eventCategory={'Мои конкурсы'} />
          </div>
        </div>
      )}

      <article className='BannerCont'>
        <div className='bannerSlider'>
          <Swiper
            ref={swiperRef}
            key={news.length}
            modules={[Navigation]}
            spaceBetween={200}
            slidesPerView={1}
            navigation
            centeredSlides
            effect="flip"
            loop
          >
            {loadingNewsloadingMyNews ? (
              <SwiperSlide>
                <LoadingEvent width="1300px" height="600px" />
              </SwiperSlide>
            ) : (
              news.map((item) => (
                <SwiperSlide key={item.id}>
                  <img
                    onClick={() => handleSlideClick(item.id)}
                    src={ item.image ? 'item.image' : '/img/image2.png'}
                    alt={item.title}
                    className="BannerImg"
                  />
                </SwiperSlide>
              ))
            )}
          </Swiper>
        </div>
      </article>

      <section className='EventsCont'>
        <ul className='statesCont'>
          {["active", "completed"].map((cat) => (
            <li
              key={cat}
              className={`stateEvent ${status === cat ? "activeCont" : ""}`}
              onClick={() => handleCategoryClick(cat)}
            >
              <b>{cat === "active" ? "Активные" : "Завершенные"}</b>
            </li>
          ))}
        </ul>

        {loading ? (
          isMobileView ? (
            <Swiper
              spaceBetween={20}
              slidesPerView={3}
              effect="flip"
              pagination={{ clickable: true }}
            >
              {Array(9).fill().map((_, i) => (
                <SwiperSlide key={i}>
                  <LoadingEvent width="40vw" height="250px" />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className='arrEvents'>
              {Array(9).fill().map((_, i) => (
                <LoadingEvent key={i} width="400px" height="250px" />
              ))}
            </div>
          )
        ) : currentEvents.length > 0 ? (
          isMobileView ? (
            <Swiper
              modules={[Navigation]}
              navigation
              spaceBetween={20}
              slidesPerView={2}
              className='mobSlaiderCont'
            >
              {currentEvents.map(item => (
                <SwiperSlide key={item.id}>
                  <Event {...item} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className='arrEvents'>
              {currentEvents.map(item => (
                <Event key={item.id} {...item} />
              ))}
            </div>
          )
        ) : (
          <div className='no-events-message'>
            <p>Нет мероприятий этой категории</p>
          </div>
        )}

        {currentEvents.length > 0 && (
          <ul className='paginationEvents'>
            <li onClick={handlePrevPage}>
              <img src='/img/arrow-circle-left.png' alt='Назад' />
            </li>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <li
                key={page}
                onClick={() => handlePageClick(page)}
                className={currentPage === page ? 'active_page' : ''}
              >
                {page}
              </li>
            ))}
            <li onClick={handleNextPage}>
              <img src='/img/arrow-circle-left.png' alt='Вперед' />
            </li>
          </ul>
        )}
      </section>
    </section>
  );
};

export default Contests;