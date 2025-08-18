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
        <img
          className={style.closeModal}
          src="img/+.png"
          onClick={closeModal}
          alt="Закрыть"
        />

        {selectedItem && (
          <div className={style.CardInfoModal}>
            <div className={style.InfoModalText}>
              <div className={style.descDocum}>
                {selectedItem.event?.title || 'Без названия'}
              </div>
              <div className={style.startDateDocum}>
                {new Date(selectedItem.issue_date).toLocaleDateString('ru-RU')}
              </div>
            </div>

            <div className={style.photoDocumModal}>
              <div className={style.imgDocum}>
                <embed
                  src={selectedItem.file_url}
                  width="100%"
                  height="100%"
                  type="application/pdf"
                />
              </div>

              <div className={style.buttonsDocum}>
                <a
                  href={selectedItem.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button>Посмотреть</button>
                </a>
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
