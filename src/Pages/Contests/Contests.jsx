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
import { AuthContext } from '../../context/AuthContext';
import useEvent from '../../API/useEvent';
import { useNavigate } from 'react-router';
import Loader from '../../Component/Loader';
import Seo from "../../components/Seo/Seo";

const Contests = () => {
  const [status, setSelectedStatus] = React.useState('active');
  const { isAuthenticated } = React.useContext(AuthContext);
  const { events, loading } = useEvent({status});
  const { data : news, isLoading:loadingNewsloadingMyNews } = usePosts();
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

  const image = [
    '/img/image2.webp',
    '/img/image 6.png',
    '/img/image2.webp',
    '/img/image 6.png'
  ]

  return (
    <>
      <Seo
        title="Конкурсы Project Team — действующие и завершённые проекты"
        description="Свежие конкурсы Project Team: участвуйте в стартапах, грантах и IT-проектах. Фильтруйте события по статусу и переходите к карточкам мероприятий."
        canonicalPath="/contests"
        ogTitle="Конкурсы Project Team"
        ogDescription="Активные и завершённые конкурсы Project Team с подробностями и ссылками на события."
        ogImage="/img/image2.webp"
        ogImageAlt="Афиша конкурсов Project Team"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Конкурсы Project Team",
          url: "https://project-team.site/contests",
          description:
            "Список действующих и завершённых конкурсов Project Team с переходами на карточки событий.",
          about: {
            "@type": "EducationalOrganization",
            name: "Project Team GGNTU",
            url: "https://project-team.site/",
          },
        }}
      />
      <section className="Contests">
        {isAuthenticated && (
          <div className="MyEvents">
            <h2>Мои конкурсы</h2>
            <div className="slider_cont">
              <Slider eventCategory={"Мои конкурсы"} />
            </div>
          </div>
        )}
        <article className="BannerCont">
          <div className="bannerSlider">
            <Swiper
              ref={swiperRef}
              modules={[Navigation]}
              spaceBetween={200}
              slidesPerView={1}
              navigation
              centeredSlides
              effect="flip"
              loop
            >
              {loadingNewsloadingMyNews ? (
                <Loader />
              ) : (
                image.map((item) => (
                  <SwiperSlide key={item.id}>
                    <img
                      onClick={() => handleSlideClick(item.id)}
                      src={item}
                      alt={item.title}
                      className="BannerImg"
                    />
                  </SwiperSlide>
                ))
              )}
            </Swiper>
          </div>
        </article>

        <section className="EventsCont">
          <ul className="statesCont">
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
              <Loader />
            ) : (
              <div className="arrEvents">
                <Loader />
              </div>
            )
          ) : currentEvents.length > 0 ? (
            isMobileView ? (
              <Swiper
                modules={[Navigation]}
                navigation
                spaceBetween={20}
                slidesPerView={2}
                breakpoints={{
                  320: {
                    slidesPerView: 1,
                  },
                  900: {
                    slidesPerView: 2,
                  },
                }}
                className="mobSlaiderCont"
              >
                {currentEvents.map((item) => (
                  <SwiperSlide key={item.id}>
                    <Event {...item} />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="arrEvents">
                {currentEvents.map((item) => (
                  <Event key={item.id} {...item} />
                ))}
              </div>
            )
          ) : (
            <Loader />
          )}

          {totalPages > 1 && (
            <ul className="paginationEvents">
              <li onClick={handlePrevPage}>
                <img src="/img/arrow-circle-left.png" alt="Назад" />
              </li>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <li
                  key={page}
                  onClick={() => handlePageClick(page)}
                  className={currentPage === page ? "active_page" : ""}
                >
                  {page}
                </li>
              ))}
              <li onClick={handleNextPage}>
                <img src="/img/arrow-circle-left.png" alt="Вперед" />
              </li>
            </ul>
          )}
        </section>
      </section>
    </>
  );
};

export default Contests;