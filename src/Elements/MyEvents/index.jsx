import React from 'react';
import style from './MyEvents.module.scss';
import useMyEvents from '../../API/useMyEvents';
import LoadEvent from '../Loading/loadingEvent'; 
import AddEventModal from './AddEventModal'

const MyEvents = () => {
  const { myEvents, loading } = useMyEvents();
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 8;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = myEvents.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(myEvents.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };


  return (
    <div className='wrapper'>
      <div className={style.MyEvents}>
        {currentPage === 1 && (
          <AddEventModal/>
        )}

        {loading ? (
          Array.from({ length: itemsPerPage }).map((_, index) => (
            <LoadEvent width="400px" height="350px" key={index} />
          ))
        ) : (
          currentItems.map((item) => (
            <div className={style.card} key={item.id}>
              <img src={item.image} alt='Проект' className={style.cardImage} />
              <div className={style.cardContent}>
                <h3 className={style.cardTitle}>{item.description}</h3>
                <p className={style.cardDescription}>Краткое описание</p>
                <button className={style.cardButton}>Подробнее</button>
              </div>
            </div>
          ))
        )}
      </div>

      <ul className={style.paginationEvents}>
        <li onClick={handlePrevPage}>
          <img src='/img/arrow-circle-left.png' alt='arrow' />
        </li>

        {loading ? (
          <li
            key={1}
            onClick={() => handlePageClick(1)}
            className={currentPage === 1 ? style.active_page : ''}
          >
            {1}
          </li>
        ) : (
          Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <li
              key={page}
              onClick={() => handlePageClick(page)}
              className={currentPage === page ? style.active_page : ''}
            >
              {page}
            </li>
          ))
        )}
        <li onClick={handleNextPage}>
          <img src='/img/arrow-circle-left.png' alt='arrow' />
        </li>
      </ul>
    </div>
  );
};

export default MyEvents;