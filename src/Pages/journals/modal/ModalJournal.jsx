// ModalJournal.jsx
import React, { useState } from 'react';
import Modal from 'react-modal';
import './ModalJournal.scss';

Modal.setAppElement('#root'); 

const ModalJournal = ({ isOpen, onRequestClose, onSubmit }) => {
  const [type, setType] = useState('meets'); 
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, date, type });
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Создание журнала"
      className="modal-journal"
      overlayClassName="modal-overlay"
    >
      <h2>Создание журнала</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Название:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <label>
          Дата:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>

        <label>
          Тип:
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="meets">Собрание</option>
            <option value="events">Мероприятие</option>
          </select>
        </label>

        <div className="actions">
          <button type="submit">Сохранить</button>
          <button type="button" onClick={onRequestClose}>Отмена</button>
        </div>
      </form>
    </Modal>
  );
};

export default ModalJournal;
