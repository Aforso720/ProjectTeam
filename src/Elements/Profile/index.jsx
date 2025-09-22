import React, { useState, useEffect, useContext } from "react";
import style from "./Profile.module.scss";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../API/axiosInstance";

const Profile = ({ handleLogout }) => {
  const { user } = useContext(AuthContext);
  const [photoUrl, setPhotoUrl] = useState("/img/kot.jpg");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    middleName: "",
    email: "",
    phone: "",
    birthDate: "",
  });

  useEffect(() => {
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

        if (userData.avatar) {
          setPhotoUrl(userData.avatar);
        } else {
          setPhotoUrl("/img/kot.jpg");
        }
      } catch (err) {
        console.log("Ошибка загрузки профиля:", err);
      }
    };

    fetchUser();
  }, [user.id]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPhotoUrl(URL.createObjectURL(file)); // превью
    }
  };

  const handleDeletePhoto = () => {
    setSelectedFile(null);
    setPhotoUrl("/img/kot.jpg");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEditClick = async () => {
    if (isEditing) {
      try {
        const form = new FormData();
        form.append("id", user.id);
        form.append("first_name", formData.firstName);
        form.append("middle_name", formData.middleName);
        form.append("last_name", formData.lastName);
        form.append("email", formData.email);
        form.append("phone", formData.phone);
        form.append("birth_date", formData.birthDate);

        if (selectedFile) {
          form.append("avatar", selectedFile);
        } else if (photoUrl === "/img/kot.jpg") {
          form.append("avatar", ""); // удаляем фото
        }

        const { data } = await axiosInstance.put(`/users/${user.id}`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const updatedUser = data.data;

        setFormData({
          lastName: updatedUser.last_name,
          firstName: updatedUser.first_name,
          middleName: updatedUser.middle_name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          birthDate: updatedUser.birth_date,
        });

        if (updatedUser.avatar) {
          setPhotoUrl(updatedUser.avatar);
        } else {
          setPhotoUrl("/img/kot.jpg");
        }

        setSelectedFile(null);
      } catch (error) {
        console.error("Ошибка при обновлении профиля:", error);
      }
    }

    setIsEditing(!isEditing);
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
