import React, { useState,  } from "react";
import { useNavigate } from "react-router";
import Modal from "react-modal";
import "./Journals.scss";
import Loader from "../../Component/Loader";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../API/axiosInstance";
// import Table from "../tables/Table";

Modal.setAppElement("#root");

const Journals = () => {
  const { authToken } = React.useContext(AuthContext);
  const [active, setActive] = useState("all");
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [newJournal, setNewJournal] = useState({
    type: "meeting",
    title: "",
    attendees: [],
  });
  const [availableParticipants, setAvailableParticipants] = useState([]);

  React.useEffect(() => {
  const fetchJournals = async () => {
    if (!authToken) {
      setError("Требуется авторизация");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const endpoint =
        active === "all"
          ? `/journals?per_page=8&page=${currentPage}`
          : `/journals?per_page=8&page=${currentPage}&type=${active}`;

      const response = await axiosInstance.get(endpoint);

      const formattedJournals = response.data.data.map((journal) => ({
        id: journal.id.toString(),
        type: journal.type,
        title: journal.title,
        date: journal.date,
        participants: journal.participants,
        user_created: journal.user_created,
      }));

      setJournals(formattedJournals);
      setCurrentPage(response.data.meta.current_page);
      setTotalPages(response.data.meta.last_page);

      if (formattedJournals.length > 0) {
        const participants = formattedJournals[0].participants.map((p) => ({
          id: p.id,
          name: p.full_name,
          group: "Группа",
          status: p.status,
        }));
        setAvailableParticipants(participants);
      } else {
        setAvailableParticipants([]);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      console.error("Ошибка при загрузке данных:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchJournals();
}, [authToken, active, currentPage]);


  const navigate = useNavigate();

  const types = [
    ["all", "Все"],
    ["meeting", "Журнал собраний"],
    ["event", "Журнал мероприятий"],
  ];

  const toggleAttendance = (id) => {
    setNewJournal((prev) => {
      const isPresent = prev.attendees.includes(id);
      return {
        ...prev,
        attendees: isPresent
          ? prev.attendees.filter((uid) => uid !== id)
          : [...prev.attendees, id],
      };
    });
  };

  const handleCreateJournal = async () => {
    if (!newJournal.title) return alert("Введите название журнала");

    try {
      const journalData = {
        title: newJournal.title,
        type: newJournal.type,
        date: new Date().toISOString().split("T")[0],
        participants: availableParticipants
          .filter((p) => newJournal.attendees.includes(p.id))
          .map((p) => ({
            user_id: p.id,
            status: "present",
          })),
      };

      const response = await axiosInstance.post("/journals/", journalData);

      const created = response.data?.id ? response.data : response.data?.data;

      if (!created?.id) {
        console.error("Некорректный ответ от сервера:", response.data);
        alert("Сервер не вернул ID журнала");
        return;
      }

      const newJournalEntry = {
        id: created.id.toString(),
        ...journalData,
        participants: created.participants || [],
        user_created: { id: 1, full_name: "Вы" },
      };

      setJournals([...journals, newJournalEntry]);
      setNewJournal({ type: "meeting", title: "", attendees: [] });
      setModalOpen(false);
    } catch (error) {
      console.error("Ошибка при создании журнала:", error);
      alert("Не удалось создать журнал");
    }
  };

  const filteredJournals =
    active === "all" ? journals : journals.filter((j) => j.type === active);

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageClick(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageClick(currentPage + 1);
    }
  };

  // const handleModalSubmit = async ({ title, date, type }) => {
  //   try {
  //     const presentParticipants = availableParticipants.filter((p) =>
  //       newJournal.attendees.includes(p.id)
  //     );

  //     const participants = presentParticipants.map((p) => ({
  //       user_id: p.id,
  //       status: "present",
  //     }));

  //     const journalData = {
  //       title,
  //       type: type === "meets" ? "meeting" : "event",
  //       date,
  //       participants,
  //     };

  //     const response = await axiosInstance.post("/journals/", journalData);

  //     const newJournalEntry = {
  //       id: response.data.id.toString(),
  //       ...journalData,
  //       user_created: { id: 1, full_name: "Вы" },
  //     };

  //     setJournals((prev) => [...prev, newJournalEntry]);
  //   } catch (error) {
  //     console.error("Ошибка при создании журнала:", error);
  //     alert("Не удалось создать журнал");
  //   }
  // };

  const handleFilterClick = (type) => {
    setActive(type);
    setCurrentPage(1);
  };

  if (loading) return <Loader />;
  if (error) return <div className="container">Ошибка: {error}</div>;

  return (
    <section className="container">
      <div className="nav-container">
        <ul>
          {types.map(([type, name]) => (
            <li
              key={type}
              className={active === type ? "active" : ""}
              onClick={() => handleFilterClick(type)}
            >
              {name}
            </li>
          ))}
        </ul>
      </div>

      <div className="journals-container">
        <div className="addJournal" onClick={() => setModalOpen(!modalOpen)}>
          <img src="/img/adminAddJournal.png" alt="" />
          <div>Добавить</div>
        </div>

        {filteredJournals.map((j) => (
          <div key={j.id} className="journal-card-modern">
            <div className="journal-header">
              <h4>
                {new Date(j.date)
                  .toLocaleString("ru-RU", {
                    month: "long",
                    year: "numeric",
                  })
                  .replace(/^./, (char) => char.toUpperCase())}
              </h4>
              <p className="subtitle">{j.title}</p>
            </div>

            <div className="journal-footer">
              <span className="date">
                {new Date(j.date).toLocaleDateString("ru-RU")}
              </span>
              <div className="buttons">
                <button
                  className="btn-outline"
                  onClick={() =>
                    navigate(`/admin/journals/${j.id}`, {
                      state: {
                        title: j.title,
                        date: j.date,
                        type: j.type,
                        students: j.participants.map((p) => ({
                          name: p.full_name,
                          group: "—",
                          mark: p.status === "present",
                        })),
                      },
                    })
                  }
                >
                  Посмотреть
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        className="modal-journal"
        overlayClassName="modal-overlay"
      >
        <h2>Создание журнала</h2>

        <input
          type="text"
          placeholder="Название журнала"
          value={newJournal.title}
          onChange={(e) =>
            setNewJournal({ ...newJournal, title: e.target.value })
          }
        />

        <select
          value={newJournal.type}
          onChange={(e) =>
            setNewJournal({ ...newJournal, type: e.target.value })
          }
        >
          <option value="meeting">Собрание</option>
          <option value="event">Мероприятие</option>
        </select>

        <div className="attendees">
          <p>Отметьте присутствующих:</p>
          <table>
            <thead>
              <tr>
                <th>Имя</th>
                <th>Присутствует</th>
              </tr>
            </thead>
            <tbody>
              {availableParticipants.map((person) => {
                const isPresent = newJournal.attendees.includes(person.id);
                return (
                  <tr key={person.id}>
                    <td>{person.name}</td>
                    <td
                      className="icon-cell"
                      onClick={() => toggleAttendance(person.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        src={isPresent ? "/img/was.png" : "/img/wasNot.png"}
                        alt={isPresent ? "Присутствовал" : "Отсутствовал"}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="actions">
          <button className="save" onClick={handleCreateJournal}>
            Сохранить
          </button>
          <button className="cancel" onClick={() => setModalOpen(false)}>
            Отмена
          </button>
        </div>
      </Modal>

      <ul className="pagination">
        <li onClick={handlePrevPage}>
          <img src="/img/arrow-circle-left.png" alt="prev" />
        </li>

        {loading ? (
          <li className="active_page">Загрузка...</li>
        ) : (
          Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <li
              key={page}
              onClick={() => handlePageClick(page)}
              className={currentPage === page ? "active_page" : ""}
            >
              {page}
            </li>
          ))
        )}

        <li onClick={handleNextPage}>
          <img
            src="/img/arrow-circle-left.png"
            alt="next"
            style={{ transform: "rotate(180deg)" }}
          />
        </li>
      </ul>
    </section>
  );
};

export default Journals;
