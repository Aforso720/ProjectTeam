import React from 'react';
import style from './MyDocument.module.scss';
import useDocument from '../../API/useDocument';
import AddDocModal from './AddDocModal';
import LoadDocum from '../Loading/loadingEvent';
import InfoModal from './InfoModal';

const MyDocument = () => {
    const { myDocument, loading } = useDocument();
    const [currentPage, setCurrentPage] = React.useState(1);
    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    const [selectedItem, setSelectedItem] = React.useState(null); 
    const itemsPerPage = 8;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = myDocument.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(myDocument.length / itemsPerPage);

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

    const openModal = (item) => {
        setSelectedItem(item);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedItem(null);
    };

    return (
        <div className={style.wrapper}>
            <div className={style.MyDocument}>
                {currentPage === 1 && <AddDocModal />}

                {loading ? (
                    Array.from({ length: itemsPerPage }).map((_, index) => (
                        <LoadDocum width="400px" height="250px" key={index} />
                    ))
                ) : (
                    currentItems.map((item) => (
                        <div
                            className={style.card}
                            key={item.id}
                            onClick={() => openModal(item)} 
                        >
                            <h3 className={style.cardTitle}>{item.description}</h3>
                            <p className={style.cardDate}>{item.startDate}</p>
                        </div>
                    ))
                )}
            </div>

            <ul className={style.pagination}>
                <li onClick={handlePrevPage}>
                    <img src='/img/arrow-circle-left.png' alt='arrow' />
                </li>

                {loading ? (
                    <li
                        key={1}
                        onClick={() => handlePageClick(1)}
                        className={currentPage === 1 ? `${style.active_page}` : ''}
                    >
                        {1}
                    </li>
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
                <li onClick={handleNextPage}>
                    <img src='/img/arrow-circle-left.png' alt='arrow' />
                </li>
            </ul>

            <InfoModal
                modalIsOpen={modalIsOpen}
                closeModal={closeModal}
                selectedItem={selectedItem} 
            />
        </div>
    );
};

export default MyDocument;