import React from 'react';
import style from './MyEvents.module.scss';
import useMyEvents from '../../API/useMyEvents';
import AddEventModal from './AddEventModal';
import InfoModalProject from './infoModalProject';
import { AuthContext } from '../../context/AuthContext';
import Loader from '../../Component/Loader';
import { normalizeImageUrl } from '../imageUtils'

const MyEvents = () => {
  const { user } = React.useContext(AuthContext);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedProject, setSelectedProject] = React.useState(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = React.useState(false);
  const itemsPerPage = 5; 

  const { myEvents, loading, meta } = useMyEvents({
    user,
    page: currentPage,
    perPage: itemsPerPage
  });

  const normalizedEvents = React.useMemo(() => {
    if (!myEvents) return [];

    return myEvents.map(event => ({
      ...event,
      preview_image: normalizeImageUrl(event.preview_image)
    }));
  }, [myEvents]);

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setIsInfoModalOpen(true);
  };

  const closeInfoModal = () => {
    setIsInfoModalOpen(false);
    setSelectedProject(null);
  };

  const handleNextPage = () => {
    if (currentPage < meta.last_page) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className='wrapper'>
      <div className={style.MyEvents}>
        {currentPage === 1 && <AddEventModal/>}

        {loading ? <Loader/> : (
          normalizedEvents.map((item) => ( 
            <div 
              className={style.card} 
              key={item.id}
              onClick={() => handleProjectClick(item)}
              style={{ cursor: 'pointer' }}
            >
              <img
                src={item.preview_image || '/img/DefaultImage.webp'}
                alt='Фото проекта'
                className={style.cardImage}
                onError={(e) => {
                  e.target.src = '/img/DefaultImage.webp';
                }}
              />
              <div className={style.cardContent}>
                <h3 className={style.cardTitle}>{item.name}</h3>
                <p className={style.cardDescription}>{item.description}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Модалка для просмотра информации о проекте */}
      <InfoModalProject
        project={selectedProject}
        isOpen={isInfoModalOpen}
        onRequestClose={closeInfoModal}
      />

      {meta.last_page > 1 && (
        <ul className={style.paginationEvents}>
          <li onClick={handlePrevPage} className={currentPage === 1 ? style.disabled : ''}>
            <img src='/img/arrow-circle-left.png' alt='prev' />
          </li>

          {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(page => (
            <li
              key={page}
              onClick={() => handlePageClick(page)}
              className={currentPage === page ? style.active_page : ''}
            >
              {page}
            </li>
          ))}

          <li onClick={handleNextPage} className={currentPage === meta.last_page ? style.disabled : ''}>
            <img src='/img/arrow-circle-left.png' alt='next' />
          </li>
        </ul>
      )}
    </div>
  );
};

export default MyEvents;