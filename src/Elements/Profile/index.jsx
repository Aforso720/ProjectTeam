import React, { useState, useEffect, useContext, useRef } from "react";
import style from "./Profile.module.scss";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../API/axiosInstance";

const DEFAULT_AVATAR = "/img/kot.jpg";

const Profile = ({ handleLogout }) => {
  const { user } = useContext(AuthContext);

  const [photoUrl, setPhotoUrl] = useState(DEFAULT_AVATAR);
  const [selectedFile, setSelectedFile] = useState(null);
  const [removeAvatarRequested, setRemoveAvatarRequested] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    middleName: "",
    email: "",
    phone: "",
    birthDate: "",
  });

  // Храним текущий objectURL, чтобы освобождать память
  const objectUrlRef = useRef(null);

  const fetchUser = async () => {
    try {
      const { data } = await axiosInstance.get(`/users/${user.id}`);
      const userData = data.data;

      setFormData({
        lastName: userData?.last_name || "",
        firstName: userData?.first_name || "",
        middleName: userData?.middle_name || "",
        email: userData?.email || "",
        phone: userData?.phone || "",
        birthDate: userData?.birth_date || "",
      });

      setPhotoUrl(userData?.avatar || DEFAULT_AVATAR);
    } catch (err) {
      console.log("Ошибка загрузки профиля:", err);
    }
  };

  useEffect(() => {
    fetchUser();

    // cleanup objectURL при размонтировании
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setRemoveAvatarRequested(false); // если выбрали новый файл, точно не удаляем

    // освобождаем предыдущий objectURL, если был
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setPhotoUrl(url);
  };

  const handleDeletePhoto = () => {
    // освобождаем objectURL, если был
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setSelectedFile(null);
    setRemoveAvatarRequested(true);
    setPhotoUrl(DEFAULT_AVATAR);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --- новые отдельные вызовы API для аватара ---
  const uploadAvatar = async (file) => {
    const form = new FormData();
    form.append("avatar", file);
    await axiosInstance.post(`/users/avatar`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  const deleteAvatar = async () => {
    await axiosInstance.delete(`/users/avatar`);
  };

  const updateProfileFields = async () => {
    const form = new FormData();
    form.append("first_name", formData.firstName);
    form.append("middle_name", formData.middleName);
    form.append("last_name", formData.lastName);
    form.append("email", formData.email);
    form.append("phone", formData.phone);
    if (formData.birthDate) form.append("birth_date", formData.birthDate);

    // ВНИМАНИЕ: файл НЕ отправляем в этот запрос
    await axiosInstance.post(`/users/${user.id}?_method=PUT`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  const handleEditClick = async () => {
    if (isEditing) {
      try {
        // 1) обновляем текстовые поля
        await updateProfileFields();

        // 2) обрабатываем аватар отдельно
        if (selectedFile instanceof File) {
          await uploadAvatar(selectedFile);
        } else if (removeAvatarRequested) {
          await deleteAvatar();
        }

        // очистим objectURL, если был
        if (objectUrlRef.current) {
          URL.revokeObjectURL(objectUrlRef.current);
          objectUrlRef.current = null;
        }

        // 3) перезагрузим пользователя
        await fetchUser();

        // 4) сброс локальных состояний
        setSelectedFile(null);
        setRemoveAvatarRequested(false);
      } catch (error) {
        console.error("Ошибка при сохранении профиля:", error);
      }
    }

    setIsEditing((prev) => !prev);
  };

  return (
    <article className={style.profile}>
      <div className={style.photoProf}>
        <img src={photoUrl} alt="Фото профиля" />
        {isEditing && (
          <div className={style.butPhotos}>
            <label htmlFor="upload-photo" className={style.addPhotos}>
              Загрузить фото
              <input
                id="upload-photo"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </label>
            <button className={style.deletePhotos} onClick={handleDeletePhoto}>
              Удалить фото
            </button>
          </div>
        )}
      </div>

      <div className={style.InfoProfile}>
        <div className={style.infoPerson}>
          <div>
            <div className={style.inputGroup}>
              <p>Фамилия</p>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                readOnly={!isEditing}
                onChange={handleInputChange}
              />
            </div>
            <div className={style.inputGroup}>
              <p>Имя</p>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                readOnly={!isEditing}
                onChange={handleInputChange}
              />
            </div>
            <div className={style.inputGroup}>
              <p>Отчество</p>
              <input
                type="text"
                name="middleName"
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
                type="email"
                name="email"
                value={formData.email}
                readOnly={!isEditing}
                onChange={handleInputChange}
              />
            </div>
            <div className={style.inputGroup}>
              <p>Телефон</p>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                readOnly={!isEditing}
                onChange={handleInputChange}
              />
            </div>

            {/* Если нужна дата рождения — раскомментируй */}
            {/* <div className={style.inputGroup}>
              <p>Дата рождения</p>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                readOnly={!isEditing}
                onChange={handleInputChange}
                min="1900-01-01"
                max="2100-12-31"
              />
            </div> */}
          </div>

          <span>
            <img
              src="/img/icons8-exit-50.png"
              alt="Выход из аккаунта"
              onClick={handleLogout}
            />
          </span>
        </div>

        <button className={style.buttonEdit} onClick={handleEditClick}>
          {isEditing ? "Сохранить" : "Редактировать"}
        </button>
      </div>
    </article>
  );
};

export default Profile;
