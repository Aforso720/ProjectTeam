import React, { useState, useEffect } from "react";
import "./PersonSetting.scss";
import usePeople from "../../API/usePeople";
import axiosInstance from "../../API/axiosInstance";
import Loader from "../../Component/Loader";
import Seo from "../../components/Seo/Seo";

const PersonSetting = () => {
  const { person: initialPeople, isLoadingTop: initialPeopleLoad } =
    usePeople();
  const [people, setPeople] = useState([]);
  const [filteredPeople, setFilteredPeople] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editStates, setEditStates] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    group: "",
    phone: "",
    email: "", // Добавь это поле
    role: "Стандарт",
  });
  const [error, setError] = useState(null);
  // для модалки с паролем
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [createdUserEmail, setCreatedUserEmail] = useState("");
  const [copyOk, setCopyOk] = useState(false);

  const handleAddUser = async () => {
    try {
      const payload = {
        first_name: newUser.firstName,
        last_name: newUser.lastName,
        is_admin: newUser.role === "Админ",
        group: newUser.group || null,
        avatar: null,
        phone: newUser.phone,
        email: newUser.email,
      };

      const response = await axiosInstance.post("/register", payload);
      // ОСТОРОЖНО: пароль показываем только в UI, в консоль НЕ логируем
      const { user, password } = response.data || {};

      setPeople((prev) => [
        ...prev,
        {
          ...user,
          role: payload.is_admin ? "Админ" : "Стандарт",
          rating: 0,
        },
      ]);

      // закроем форму добавления
      setIsModalOpen(false);

      // очистим форму
      setNewUser({
        name: "",
        group: "",
        phone: "",
        email: "",
        role: "Стандарт",
        firstName: "",
        lastName: "",
        middleName: "",
      });

      setError(null);

      // откроем модалку с паролем
      if (password) {
        setGeneratedPassword(password);
        setCreatedUserEmail(user?.email || "");
        setIsPasswordModalOpen(true);
        setCopyOk(false);
      }
    } catch (error) {
      console.error(
        "❌ Ошибка при создании пользователя:",
        error.response?.data || error.message
      );
      setError(
        "Не удалось добавить пользователя. Проверьте данные и попробуйте снова."
      );
    }
  };

  useEffect(() => {
    if (initialPeople) {
      const mappedPeople = initialPeople.map((person) => ({
        ...person,
        role: person.is_admin ? "Админ" : "Стандарт",
        rating: person.rating || 0,
      }));
      setPeople(mappedPeople);
      setFilteredPeople(mappedPeople);
    }
  }, [initialPeople]);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredPeople(people);
    } else {
      const filtered = people.filter((person) =>
        `${person.first_name} ${person.last_name} ${person.middle_name || ""}`
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
      const response = await axiosInstance.put(`/users/${id}`, {
        rating: person.rating,
      });

      console.log(`Рейтинг пользователя ${id} обновлен`, response.data);

      setEditStates((prev) => ({
        ...prev,
        [id]: false,
      }));

      setError(null);
    } catch (error) {
      console.log("Ошибка при обновлении рейтинга:", error);
      setError("Не удалось обновить рейтинг. Пожалуйста, попробуйте снова.");
      setPeople((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                rating: initialPeople.find((ip) => ip.id === id)?.rating || 0,
              }
            : p
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
      const isAdmin = newRole === "Админ";
      await axiosInstance.put(`/users/${id}`, {
        is_admin: isAdmin,
      });

      setPeople((prev) =>
        prev.map((person) =>
          person.id === id
            ? { ...person, role: newRole, is_admin: isAdmin }
            : person
        )
      );
      console.log(`Роль пользователя ${id} изменена на ${newRole}`);
    } catch (error) {
      console.error("Ошибка при изменении роли:", error);
      setError("Не удалось изменить роль. Пожалуйста, попробуйте снова.");
    }
  };

  const handleDeleteUser = async (id) => {
    const confirmation = prompt(
      'Вы уверены, что хотите удалить этого пользователя? Введите "да" для подтверждения:'
    );
    if (confirmation?.toLowerCase() === "да") {
      try {
        await axiosInstance.delete(`/users/${id}`);

        setPeople((prev) => prev.filter((person) => person.id !== id));
        console.log(`Пользователь ${id} удален`);
      } catch (error) {
        console.error("Ошибка при удалении пользователя:", error);
        setError(
          "Не удалось удалить пользователя. Пожалуйста, попробуйте снова."
        );
      }
    } else {
      console.log("Удаление отменено");
    }
  };

  if (initialPeopleLoad) return <Loader />;

  return (
    <>
      <Seo
        title="Администрирование участников — Project Team"
        description="Редактируйте роли, рейтинги и учетные записи участников команды Project Team."
        canonicalPath="/admin/managing"
        ogTitle="Администрирование участников"
        ogDescription="Панель управления участниками Project Team доступна только администраторам."
        robots="noindex, nofollow"
      />
      <section className="person-setting">
        <header className="header">
          <h2 style={{ color: "white" }}>Управление участниками</h2>
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
            <button className="add-btn" onClick={() => setIsModalOpen(true)}>
              Добавить
            </button>
          </div>
        </header>

        {error && <div className="error-message">{error}</div>}

        <ul className="people-list">
          {filteredPeople.map((person) => (
            <li className="person-card" key={person.id}>
              <div className="person-info">
                <img src={person.image || "/img/kot.jpg"} alt="Ava" />
                <div>
                  <h3>
                    {person.first_name} {person.last_name}
                  </h3>
                  <p>{person.middle_name || ""}</p>
                </div>
              </div>

              <div className="person-controls">
                <div className="rating-edit">
                  <input
                    type="number"
                    value={person.rating}
                    onChange={(e) =>
                      handleRatingChange(person.id, e.target.value)
                    }
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
                    onChange={(e) =>
                      handleRoleChange(person.id, e.target.value)
                    }
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
          <article className="modal-overlay">
            <section className="modal">
              <h2>Добавить участника</h2>

              <div className="input-row">
                <div>
                  <label>Фамилия</label>
                  <input
                    type="text"
                    value={newUser.lastName || ""}
                    onChange={(e) =>
                      setNewUser({ ...newUser, lastName: e.target.value })
                    }
                    placeholder="Введите фамилию"
                  />
                </div>
                <div>
                  <label>Имя</label>
                  <input
                    type="text"
                    value={newUser.firstName || ""}
                    onChange={(e) =>
                      setNewUser({ ...newUser, firstName: e.target.value })
                    }
                    placeholder="Введите имя"
                  />
                </div>
                <div>
                  <label>Отчество</label>
                  <input
                    type="text"
                    value={newUser.middleName || ""}
                    onChange={(e) =>
                      setNewUser({ ...newUser, middleName: e.target.value })
                    }
                    placeholder="Введите отчество"
                  />
                </div>
              </div>

              <div className="input-row">
                <div>
                  <label>Email</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    placeholder="example@domain.com"
                  />
                </div>
                <div>
                  <label>Номер телефона</label>
                  <input
                    type="text"
                    value={newUser.phone}
                    onChange={(e) =>
                      setNewUser({ ...newUser, phone: e.target.value })
                    }
                    placeholder="8(999) 999-99-99"
                  />
                </div>
              </div>

              <div className="input-row">
                <div>
                  <label>Группа</label>
                  <input
                    type="text"
                    value={newUser.group}
                    onChange={(e) =>
                      setNewUser({ ...newUser, group: e.target.value })
                    }
                    placeholder="ПИ-22-1"
                  />
                </div>
                <div>
                  <label>Статус</label>
                  <select
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser({ ...newUser, role: e.target.value })
                    }
                    className="status-select"
                  >
                    <option value="Админ">Админ</option>
                    <option value="Стандарт">Участник</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  className="cancel-btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  Закрыть
                </button>
                <button className="confirm-btn" onClick={handleAddUser}>
                  Добавить
                </button>
              </div>
            </section>
          </article>
        )}
        {isPasswordModalOpen && (
          <article className="modal-overlay">
            <section className="modal">
              <h2>Пароль для нового пользователя</h2>

              {createdUserEmail && (
                <p className="hint">
                  Пользователь: <b>{createdUserEmail}</b>
                </p>
              )}

              <div className="password-box">
                <input
                  type="text"
                  value={generatedPassword}
                  readOnly
                  className="password-input"
                  onFocus={(e) => e.currentTarget.select()}
                />
                <button
                  className="copy-btn"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(
                        generatedPassword
                      );
                      setCopyOk(true);
                      setTimeout(() => setCopyOk(false), 2000);
                    } catch {
                      // fallback: выделим текст, пусть пользователь скопирует вручную
                      setCopyOk(false);
                    }
                  }}
                >
                  Скопировать
                </button>
              </div>

              <p className="warning">
                Пожалуйста, сохраните этот пароль. Он отображается только
                один раз.
              </p>

              <div className="modal-actions">
                <button
                  className="confirm-btn"
                  onClick={() => setIsPasswordModalOpen(false)}
                >
                  Готово
                </button>
              </div>

              {copyOk && (
                <div className="copied-toast">Скопировано ✅</div>
              )}
            </section>
          </article>
        )}
      </section>
    </>
  );
};

export default PersonSetting;
