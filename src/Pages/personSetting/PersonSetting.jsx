import React, { useState, useEffect } from 'react';
import './PersonSetting.scss';
import { MyContext } from '../../App';
import axios from 'axios';

const PersonSetting = () => {
  const { topPerson: initialPeople, isloadingTop: initialPeopleLoad } = React.useContext(MyContext);
  const [people, setPeople] = useState([]);
  const [filteredPeople, setFilteredPeople] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editStates, setEditStates] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    group: '',
    phone: '',
    role: 'Стандарт',
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialPeople) {
      const mappedPeople = initialPeople.map(person => ({
        ...person,
        role: person.is_admin ? 'Админ' : 'Стандарт',
        rating: person.rating || 0
      }));
      setPeople(mappedPeople);
      setFilteredPeople(mappedPeople);
    }
  }, [initialPeople]);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredPeople(people);
    } else {
      const filtered = people.filter(person => 
        `${person.first_name} ${person.last_name} ${person.middle_name || ''}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
      setFilteredPeople(filtered);
    }
  }, [searchTerm, people]);

  const handleEditClick = (id) => {
    setEditStates((prev) => ({
      ...prev,
      [id]: true,
    }));
  };

  const handleRatingChange = (id, value) => {
    setPeople((prev) =>
      prev.map((person) =>
        person.id === id ? { ...person, rating: Number(value) } : person
      )
    );
  };

  const handleSaveRating = async (id) => {
    try {
      const person = people.find((p) => p.id === id);
      const response = await axios.put(`http://localhost:5555/api/users/${id}`, {
        rating: person.rating
      });
      
      console.log(`Рейтинг пользователя ${id} обновлен`, response.data);
      
      setEditStates((prev) => ({
        ...prev,
        [id]: false,
      }));
      
      setError(null);
    } catch (error) {
      console.log('Ошибка при обновлении рейтинга:', error);
      setError('Не удалось обновить рейтинг. Пожалуйста, попробуйте снова.');
      setPeople(prev => 
        prev.map(p => 
          p.id === id ? { ...p, rating: initialPeople.find(ip => ip.id === id)?.rating || 0 } : p
        )
      );
    }
  };

  const handleBlur = (id) => {
    setTimeout(() => {
      setEditStates((prev) => ({
        ...prev,
        [id]: false,
      }));
    }, 200);
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      const isAdmin = newRole === 'Админ';
      await axios.put(`http://localhost:5555/api/users/${id}`, {
        is_admin: isAdmin
      });
      setPeople(prev => 
        prev.map(person => 
          person.id === id 
            ? { ...person, role: newRole, is_admin: isAdmin } 
            : person
        )
      );
      console.log(`Роль пользователя ${id} изменена на ${newRole}`);
    } catch (error) {
      console.error('Ошибка при изменении роли:', error);
      setError('Не удалось изменить роль. Пожалуйста, попробуйте снова.');
    }
  };

  const handleDeleteUser = async (id) => {
    const confirmation = prompt('Вы уверены, что хотите удалить этого пользователя? Введите "да" для подтверждения:');
    if (confirmation?.toLowerCase() === 'да') {
      try {
        await axios.delete(`http://localhost:5555/api/users/${id}`);
        setPeople(prev => prev.filter(person => person.id !== id));
        console.log(`Пользователь ${id} удален`);
      } catch (error) {
        console.error('Ошибка при удалении пользователя:', error);
        setError('Не удалось удалить пользователя. Пожалуйста, попробуйте снова.');
      }
    } else {
      console.log('Удаление отменено');
    }
  };

  return (
    <div className='person-setting'>
      <div className="header">
        <h2>Управление участниками</h2>
        <div className="header-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Поиск участников..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
          <button className="add-btn" onClick={() => setIsModalOpen(true)}>Добавить</button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <ul className="people-list">
        {filteredPeople.map(person => (
          <li className="person-card" key={person.id}>
            <div className="person-info">
              <img src={person.image || '/img/kot.jpg'} alt='Ava' />
              <div>
                <h3>{person.first_name} {person.last_name}</h3>
                <p>{person.middle_name || ''}</p>
              </div>
            </div>

            <div className="person-controls">
              <div className="rating-edit">
                <input
                  type="number"
                  value={person.rating}
                  onChange={(e) => handleRatingChange(person.id, e.target.value)}
                  onFocus={() => handleEditClick(person.id)}
                  onBlur={() => handleBlur(person.id)}
                />
                {editStates[person.id] && (
                  <button 
                    className="save-btn" 
                    onClick={() => handleSaveRating(person.id)}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    Сохранить
                  </button>
                )}
              </div>

              <div className="buttons">
                <select 
                  value={person.role}
                  onChange={(e) => handleRoleChange(person.id, e.target.value)}
                >
                  <option value="Админ">Админ</option>
                  <option value="Стандарт">Стандарт</option>
                </select>
                <button 
                  className="delete-btn"
                  onClick={() => handleDeleteUser(person.id)}
                >
                  Удалить
                </button>
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
                  setIsModalOpen(false); 
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