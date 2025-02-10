import React from 'react'

const Account = () => {
  return (
    <div className='Account'>
        <ul className='navigAccount'>
            <li className='activeAcc'>Личные данные</li>
            <li>Мои проекты</li>
            <li>Мои сертификаты</li>
            <li>Выход</li>
        </ul>
      <div className='profile'>
            <div className='photoProf'>
                <img src='img/Mask group.png' alt='Фото профиля' />
                <div className='butPhotos'>
                    <button className='addPhotos'>Загрузить фото</button>
                    <button className='deletePhotos'>Удалить фото</button>
                </div>
            </div>
            <div className='InfoProfile'>
                <div className='infoPerson'>
                    <div className='leftSide'>
                      <div className='inputGroup'>
                          <p>Фамилия</p>
                          <input type='text' value="Иванов" readOnly />
                      </div>
                      <div className='inputGroup'>
                          <p>Имя</p>
                          <input type='text' value="Иван" readOnly />
                      </div>
                      <div className='inputGroup'>
                          <p>Отчество</p>
                          <input type='text' value="Иванович" readOnly />
                      </div>
                    </div>
                   <div className='rightSide'>
                    <div className='inputGroup'>
                          <p>Email</p>
                          <input type='email' value="ivanov@example.com" readOnly />
                      </div>
                      <div className='inputGroup'>
                          <p>Телефон</p>
                          <input type='number' value="1234567890" readOnly />
                      </div>
                      <div className='inputGroup'>
                          <p>Дата рождения</p>
                          <input type='date' value="1990-01-01" readOnly />
                      </div>
                    </div>
                    <span>#1</span>
                </div>
                <div className='buttonProfile'>
                  <button className='buttonEdit'>Редактировать</button>
                    {/* <button className='buttonEdit'>Сохранить</button>
                    <button className='buttonCancel'>Отмена</button> */}
                </div>
            </div>
      </div>
    </div>
  )
}

export default Account