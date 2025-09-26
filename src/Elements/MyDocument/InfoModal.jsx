import React from 'react';
import Modal from 'react-modal';
import style from './MyDocument.module.scss';

const InfoModal = ({ modalIsOpen, closeModal, selectedItem }) => {
  const fileUrl = selectedItem?.file_url || '';
  const title = selectedItem?.event?.title || 'Без названия';

  const isPdf = React.useMemo(() => {
    if (!fileUrl) return false;
    try {
      const cleanUrl = fileUrl.split('?')[0]?.toLowerCase() || '';
      return cleanUrl.endsWith('.pdf');
    } catch (error) {
      console.error('Не удалось определить тип файла сертификата', error);
      return false;
    }
  }, [fileUrl]);

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      className={style.InfoModal}
      overlayClassName={style.Overlay}
      ariaHideApp={false}
    >
      <div className={style.InfoModalContent}>
        <h2>Информация о сертификате</h2>
        <img
          className={style.closeModal}
          src="img/+.png"
          onClick={closeModal}
          alt="Закрыть"
        />

        {selectedItem ? (
          <div className={style.CardInfoModal}>
            <div className={style.InfoModalText}>
              <div className={style.descDocum}>{title}</div>
              <div className={style.startDateDocum}>
                {new Date(selectedItem.issue_date).toLocaleDateString('ru-RU')}
              </div>
            </div>

            <div className={style.photoDocumModal}>
              {fileUrl ? (
                <div className={`${style.imgDocum} media-contain`}>
                  {isPdf ? (
                    <embed
                      src={fileUrl}
                      type="application/pdf"
                      className={style.docEmbed}
                    />
                  ) : (
                    <img src={fileUrl} alt={title} />
                  )}
                </div>
              ) : (
                <div className={style.documPlaceholder}>
                  Файл сертификата не найден
                </div>
              )}

              <div className={style.buttonsDocum}>
                {fileUrl && (
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className={style.primaryButton}>Посмотреть</button>
                  </a>
                )}
                <button className={style.secondaryButton}>Удалить</button>
              </div>
            </div>
          </div>
        ) : (
          <div className={style.documPlaceholder}>Сертификат не выбран</div>
        )}
      </div>
    </Modal>
  );
};

export default InfoModal;
