import React from 'react'
import Modal from 'react-modal';
import style from './MyEvents.module.scss'

const AddEventModal = () => {
    const [modalIsOpen, setModalIsOpen] = React.useState(false);

    const openModal = () => {
      setModalIsOpen(true);
    };
    
    const closeModal = () => {
      setModalIsOpen(false);
    };

    const customStyles = {
      content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          height: '65%',
          padding: '0',
          borderRadius: '10px',
          backgroundColor: '#fff',
          border: '1px solid #ccc',
      },
      overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.75)', 
      },
  };

  return (
    <div>
            <div className={style.addedEvent}>
            <img src='/img/carbon_ibm-cloud-projects.png' alt='img' />
            <button onClick={openModal}>Добавить проект</button>
          </div>
      <Modal 
      isOpen={modalIsOpen} 
      onRequestClose={closeModal}
      style={customStyles}
      >
     <div className={style.Modal}>
          <h2>Добавить сертификат</h2>
          <img className={style.closeModal} src="img/+.png" onClick={closeModal} alt=""/>
          <div className={style.contentDocum}>
            <input className={style.infoDocum} placeholder='Кто выдал. Пример: Сертификат HTTM'/>
            <input className={style.DataDocum} placeholder='Дата получения. Пример: 01.01.2025'/>
            <div className={style.addedPhoto}>
              <img src="img/gallery-add.png" alt=""/>
              <p>Загрузите сертификат</p>
            </div>
          </div>
        </div>
    </Modal>
    </div>
  )
}

export default AddEventModal;