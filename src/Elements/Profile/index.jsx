import React from 'react';
import style from './Profile.module.scss';

const Profile = () => {
  return (
    <div className={style.profile}>
      <div className={style.photoProf}>
        <img src='img/Mask group.png' alt='Фото профиля' />
        <div className={style.butPhotos}>
          <button className={style.addPhotos}>Загрузить фото</button>
          <button className={style.deletePhotos}>Удалить фото</button>
        </div>
      </div>
      <div className={style.InfoProfile}>
        <div className={style.infoPerson}>
          <div className={style.leftSide}>
            <div className={style.inputGroup}>
              <p>Фамилия</p>
              <input type='text' value="Иванов" readOnly />
            </div>
            <div className={style.inputGroup}>
              <p>Имя</p>
              <input type='text' value="Иван" readOnly />
            </div>
            <div className={style.inputGroup}>
              <p>Отчество</p>
              <input type='text' value="Иванович" readOnly />
            </div>
          </div>
          <div className={style.rightSide}>
            <div className={style.inputGroup}>
              <p>Email</p>
              <input type='email' value="ivanov@example.com" readOnly />
            </div>
            <div className={style.inputGroup}>
              <p>Телефон</p>
              <input type='number' value="1234567890" readOnly />
            </div>
            <div className={style.inputGroup}>
              <p>Дата рождения</p>
              <input type='date' value="1990-01-01" readOnly />
            </div>
          </div>
          <span>#1</span>
        </div>
        <div className={style.buttonProfile}>
          <button className={style.buttonEdit}>Редактировать</button>
          {/* <button className={style.buttonEdit}>Сохранить</button>
            <button className={style.buttonCancel}>Отмена</button> */}
        </div>
      </div>
    </div>
  );
};

export default Profile;