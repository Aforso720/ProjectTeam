import React from 'react';
import Modal from 'react-modal';
import style from './MyEvents.module.scss';

const AddEventModal = () => {
    const [modalIsOpen, setModalIsOpen] = React.useState(false);

    const [participants, setParticipants] = React.useState([
  'Эльдарханов Абдул–Малик',
  'Алаудинов Илисхан'
]);
const [newParticipant, setNewParticipant] = React.useState('');

const handleAddParticipant = () => {
  if (newParticipant.trim()) {
    setParticipants([...participants, newParticipant.trim()]);
    setNewParticipant('');
  }
};

const handleRemoveParticipant = (index) => {
  const updated = [...participants];
  updated.splice(index, 1);
  setParticipants(updated);
};


    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)',
            width: '800px',
            maxWidth: '95%',
            padding: '30px',
            borderRadius: '12px',
            backgroundColor: '#fff',
            border: '1px solid #4B1218',
        },
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
                ariaHideApp={false}
            >
                <div className={style.Modal}>
                    <div className={style.modalHeader}>
                        <h2>Добавление проекта</h2>
                        <button className={style.closeButton} onClick={closeModal}>✕</button>
                    </div>

                    <div className={style.section}>
                        <input type="text" className={style.projectInput} placeholder="Название проекта" />
                        <input type="text" className={style.projectInput} placeholder="Дата создания" />
                        <textarea className={style.projectInput} placeholder="Краткое описание" rows="3" />
                    </div>

                    <div className={style.section}>
  <h3>Добавить участников</h3>
  <div className={style.participantsList}>
    {participants.map((name, index) => (
      <div key={index} className={style.participantItem}>
        <span>{name}</span>
        <button
          type="button"
          className={style.removeButton}
          onClick={() => handleRemoveParticipant(index)}
        >
          ✕
        </button>
      </div>
    ))}
    <div className={style.addParticipantRow}>
      <input
        type="text"
        value={newParticipant}
        onChange={(e) => setNewParticipant(e.target.value)}
        className={style.participantInput}
        placeholder="Введите имя участника"
      />
      <button
        type="button"
        className={style.addButton}
        onClick={handleAddParticipant}
      >
        +
      </button>
    </div>
  </div>
</div>


                    <div className={style.section}>
                        <select className={style.projectInput}>
                            <option value="">Выберите мероприятие</option>
                            {/* Примеры:
                            <option value="event1">Мероприятие 1</option>
                            */}
                        </select>
                    </div>

                    <div className={style.section}>
                        <h3>Медиафайлы</h3>
                        <div className={style.fileList}>
                            <label className={style.fileUpload}>
                                <input type="file" hidden multiple />
                                <div>📁 Прикрепить медиафайл</div>
                            </label>
                            <div className={style.fileItem}>PDF</div>
                            <div className={style.fileItem}>PPTX</div>
                            <div className={style.fileItem}>PDF</div>
                            <div className={style.fileItem}>PPTX</div>
                        </div>
                    </div>

                    <div className={style.section}>
                        <button className={style.saveButton}>Сохранить</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AddEventModal;
