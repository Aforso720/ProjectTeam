import React from 'react';
import Modal from 'react-modal';
import style from './MyDocument.module.scss';

const InfoModal = ({ modalIsOpen, closeModal, selectedItem }) => {
    return (
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            className={style.ModalInfo}
            overlayClassName={style.Overlay}
        >
            <div className={style.ModalInfoChild}>
            <h2>Информация о сертификате</h2>
            <img className={style.closeModal} src="img/+.png" onClick={closeModal} alt=""/>
                {selectedItem && (
                    <div className={style.CardInfoModal}>
                    <div className={style.InfoModalText}>
                        <div className={style.descDocum}>{selectedItem.description}</div>
                        <div className={style.startDateDocum}>{selectedItem.startDate}</div>
                    </div>
                    <div className={style.photoDocumModal}>
                        <div className={style.imgDocum}>
                            <img src='img/3232.png' alt=''/>
                        </div>
                        <div className={style.buttonsDocum}>
                        <button>Посмотреть</button>
                        <button>Удалить</button>
                        </div>
                    </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default InfoModal;