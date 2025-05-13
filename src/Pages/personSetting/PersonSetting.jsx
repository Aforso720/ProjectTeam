import React, { useState } from 'react';
import './PersonSetting.scss';

const initialPeople = [
  {
    id: 1,
    name: 'Джейсон Стетхем',
    group: 'ПИ-22-1',
    image: '/img/kot.jpg',
    code: '7777',
    role: 'Админ',
  },
  {
    id: 2,
    name: 'Бетмен',
    group: 'ПИ-22-1',
    image: '/img/kot.jpg',
    code: '7777',
    role: 'Стандарт',
  },
];

const PersonSetting = () => {
  const [people, setPeople] = useState(initialPeople);
  const [editStates, setEditStates] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
  name: '',
  group: '',
  phone: '',
  role: 'Стандарт',
});


  const handleEditClick = (id) => {
    setEditStates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCodeChange = (id, value) => {
    setPeople((prev) =>
      prev.map((person) =>
        person.id === id ? { ...person, code: value } : person
      )
    );
  };

  const handleSave = (id) => {
    const person = people.find((p) => p.id === id);
    console.log(`Сохранено для ID ${id}:`, person.code);

    setEditStates((prev) => ({
      ...prev,
      [id]: false,
    }));
  };

  return (
    <div className='person-setting'>
      <div className="header">
        <h2>Управление участниками</h2>
        <button className="add-btn" onClick={() => setIsModalOpen(true)}>Добавить</button>
      </div>

      <ul className="people-list">
        {people.map(person => (
          <li className="person-card" key={person.id}>
            <div className="person-info">
              <img src={person.image} alt='Ava' />
              <div>
                <h3>{person.name}</h3>
                <p>{person.group}</p>
              </div>
            </div>

            <div className="person-controls">
              <div className="code-edit">
                {editStates[person.id] ? (
                  <>
                    <input
                      type="number"
                      value={person.code}
                      onChange={(e) => handleCodeChange(person.id, e.target.value)}
                    />
                    <button className="save-btn" onClick={() => handleSave(person.id)}>
                      Сохранить
                    </button>
                  </>
                ) : (
                  <div className="code-display" onClick={() => handleEditClick(person.id)}>
                    {person.code}
                  </div>
                )}
              </div>

              <div className="buttons">
                <select defaultValue={person.role}>
                  <option value="Админ">Админ</option>
                  <option value="Стандарт">Стандарт</option>
                </select>
                <button className="delete-btn">Удалить</button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {isModalOpen && (
  <div className="modal-overlay">
    <div className="modal">
      <h2>Добавить участника</h2>

      <label>ФИО</label>
      <input
        type="text"
        value={newUser.name}
        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
        placeholder="Введите ФИО"
      />

      <div className="input-row">
        <div>
          <label>Группа</label>
          <input
            type="text"
            value={newUser.group}
            onChange={(e) => setNewUser({ ...newUser, group: e.target.value })}
            placeholder="ПИ-22-1"
          />
        </div>
        <div>
          <label>Номер телефона</label>
          <input
            type="text"
            value={newUser.phone}
            onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
            placeholder="8(999) 999-99-99"
          />
        </div>
      </div>

      <div className="input-row">
        <div>
          <label>Статус</label>
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          >
            <option value="Админ">Админ</option>
            <option value="Стандарт">Стандарт</option>
          </select>
        </div>
      </div>

      <div className="modal-actions">
        <button onClick={() => setIsModalOpen(false)}>Закрыть</button>
        <button
          onClick={() => {
            console.log('Добавлен пользователь:', newUser);
            setIsModalOpen(false); // закроем окно после логирования
          }}
        >
          Добавить
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default PersonSetting;
