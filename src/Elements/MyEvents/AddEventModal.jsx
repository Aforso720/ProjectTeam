import React from 'react';
import Modal from 'react-modal';
import style from './MyEvents.module.scss';

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
            width: '600px',
            maxWidth: '90%',
            padding: '20px',
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
                ariaHideApp={false}
            >
                <div className={style.Modal}>
                    <div className={style.modalHeader}>
                        <h2>Добавление проекта</h2>
                        <button className={style.closeButton} onClick={closeModal}>✕</button>
                    </div>
                    
                    <div className={style.section}>
                        <h3>Название проекта</h3>
                        <input type="text" className={style.projectInput} placeholder="Введите название проекта" />
                    </div>
                    
                    <div className={style.checkboxSection}>
                        <label className={style.checkboxLabel}>
                            <input type="checkbox" /> Дата создания
                        </label>
                        <label className={style.checkboxLabel}>
                            <input type="checkbox" /> Краткое описание
                        </label>
                    </div>
                    
                    <div className={style.section}>
                        <h3>Добавить участников</h3>
                        <div className={style.participantsList}>
                            <label className={style.checkboxLabel}>
                                <input type="checkbox" /> ✕ Эльдарханов Абдул-Малик
                            </label>
                            <label className={style.checkboxLabel}>
                                <input type="checkbox" /> ✕ Алаудинов Илисхан
                            </label>
                        </div>
                    </div>
                    
                    <hr className={style.divider} />
                    
                    <div className={style.section}>
                        <h3>Выберите мероприятие</h3>
                        <div className={style.mediaFiles}>
                            <h4>Медиафайлы</h4>
                            <div className={style.fileList}>
                                <div className={style.fileItem}>PDF</div>
                                <div className={style.fileItem}>PPTX</div>
                                <div className={style.fileItem}>PDF</div>
                                <div className={style.fileItem}>PPTX</div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AddEventModal;