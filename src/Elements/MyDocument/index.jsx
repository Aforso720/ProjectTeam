import React from 'react';
import style from './MyDocument.module.scss';
import useDocument from '../../API/useDocument';
import AddDocModal from './AddDocModal';
import InfoModal from './InfoModal';
import Loader from '../../Component/Loader';

const MyDocument = () => {
  const { myDocument, loading, fetchData } = useDocument();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState(null);

  // Берём данные и мету
  const documents = myDocument?.data || [];
  const meta = myDocument?.meta || { current_page: 1, last_page: 1 };
  const totalPages = meta.last_page;

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      fetchData(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      fetchData(currentPage - 1);
    }
  };

  const handlePageClick = (page) => {
    if (page !== currentPage) {
      setCurrentPage(page);
      fetchData(page);
    }
  };

  const openModal = (item) => {
    setSelectedItem(item);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedItem(null);
  };

  return (
    <section className={style.wrapper}>
      <div className={style.MyDocument}>
        {currentPage === 1 && <AddDocModal onDocumentAdded={fetchData} />}

        {loading ? (
          <Loader />
        ) : (
          documents.map((item) => (
            <div
              className={style.card}
              key={item.id}
              onClick={() => openModal(item)}
            >
              <h3 className={style.cardTitle}>
                {item.issued_by || 'Без названия'}
              </h3>
              <p className={style.cardDate}>
                {new Date(item.issue_date).toLocaleDateString('ru-RU')}
              </p>
            </div>
          ))
        )}
      </div>

      {/* пагинация только если страниц больше одной */}
      {totalPages > 1 && (
        <ul className={style.pagination}>
          <li
            onClick={handlePrevPage}
            className={currentPage === 1 ? style.disabled : ''}
          >
            <img src='/img/arrow-circle-left.png' alt='prev' />
          </li>

          {loading ? (
            <li className={style.active_page}>Загрузка...</li>
          ) : (
            Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li
                key={page}
                onClick={() => handlePageClick(page)}
                className={currentPage === page ? style.active_page : ''}
              >
                {page}
              </li>
            ))
          )}

          <li
            onClick={handleNextPage}
            className={currentPage === totalPages ? style.disabled : ''}
          >
            <img
              src='/img/arrow-circle-left.png'
              alt='next'
              style={{ transform: 'rotate(180deg)' }}
            />
          </li>
        </ul>
      )}

      <InfoModal
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        selectedItem={selectedItem}
      />
    </section>
  );
};

export default MyDocument;
