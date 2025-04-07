import React, { useState } from 'react';
import style from './Profile.module.scss';

const Profile = () => {
    const [photoUrl, setPhotoUrl] = useState('/img/kot.jpg');
    const [isEditing, setIsEditing] = useState(false); // Режим редактирования
    const [formData, setFormData] = useState({
        lastName: 'Алаудинов',
        firstName: 'Илисхан',
        middleName: 'Самрудинович',
        email: 'alaudinovis@mail.ru',
        phone: '89380190528',
        birthDate: '2003-05-14',
    });

    // Обработчик загрузки фотографии
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPhotoUrl(url);
            console.log('Фото загружено (mock):', file.name);
        }
    };

    // Обработчик удаления фотографии
    const handleDeletePhoto = () => {
        setPhotoUrl('/img/kot.jpg');
        console.log('Фото удалено (mock)');
    };

    // Обработчик изменения полей
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Обработчик кнопки "Редактировать"
    const handleEditClick = () => {
        if (isEditing) {
            // Сохраняем изменения (здесь можно добавить запрос на сервер)
            console.log('Данные сохранены:', formData);
        }
        setIsEditing(!isEditing); // Переключаем режим редактирования
    };

    return (
        <div className={style.profile}>
            <div className={style.photoProf}>
                <img src={photoUrl} alt='Фото профиля' />
                <div className={style.butPhotos}>
                    <label htmlFor="upload-photo" className={style.addPhotos}>
                        Загрузить фото
                        <input
                            id="upload-photo"
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                    </label>
                    <button className={style.deletePhotos} onClick={handleDeletePhoto}>
                        Удалить фото
                    </button>
                </div>
            </div>
            <div className={style.InfoProfile}>
                <div className={style.infoPerson}>
                    <div>
                        <div className={style.inputGroup}>
                            <p>Фамилия</p>
                            <input
                                type='text'
                                name='lastName'
                                value={formData.lastName}
                                readOnly={!isEditing}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className={style.inputGroup}>
                            <p>Имя</p>
                            <input
                                type='text'
                                name='firstName'
                                value={formData.firstName}
                                readOnly={!isEditing}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className={style.inputGroup}>
                            <p>Отчество</p>
                            <input
                                type='text'
                                name='middleName'
                                value={formData.middleName}
                                readOnly={!isEditing}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div>
                        <div className={style.inputGroup}>
                            <p>Email</p>
                            <input
                                type='email'
                                name='email'
                                value={formData.email}
                                readOnly={!isEditing}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className={style.inputGroup}>
                            <p>Телефон</p>
                            <input
                                type='number'
                                name='phone'
                                value={formData.phone}
                                readOnly={!isEditing}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className={style.inputGroup}>
                            <p>Дата рождения</p>
                            <input
                                type='date'
                                name='birthDate'
                                value={formData.birthDate}
                                readOnly={!isEditing}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <span>#1</span>
                </div>
                <button className={style.buttonEdit} onClick={handleEditClick}>
                    {isEditing ? 'Сохранить' : 'Редактировать'}
                </button>
            </div>
        </div>
    );
};

export default Profile;