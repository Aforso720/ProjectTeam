import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import "./Journals.scss";

Modal.setAppElement("#root");

const Journals = () => {
  const [active, setActive] = useState("all");
  const [journals, setJournals] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newJournal, setNewJournal] = useState({
    type: "meets",
    title: "",
    attendees: [],
  });

  React.useEffect(() => {
    const defaultJournals = [
      {
        id: "1",
        type: "meets",
        title: "Организационное собрание",
        date: new Date("2023-05-10").toISOString(),
        attendees: [1, 2, 3, 4, 5],
      },
      {
        id: "2",
        type: "events",
        title: "Технический семинар",
        date: new Date("2023-05-15").toISOString(),
        attendees: [1, 3, 5, 7, 9],
      },
      {
        id: "3",
        type: "meets",
        title: "Планирование проекта",
        date: new Date("2023-05-20").toISOString(),
        attendees: [2, 4, 6, 8, 10],
      },
    ];

    setJournals(defaultJournals.map(journal => ({
      ...journal,
      students: dummyPeople.map(p => ({
        name: p.name,
        group: p.group,
        mark: journal.attendees.includes(p.id),
      })),
    })));
  }, []);

  const navigate = useNavigate();

  const types = [
    ["all", "Все"],
    ["meets", "Журнал собраний"],
    ["events", "Журнал мероприятий"]
  ];

  const dummyPeople = [
  { id: 1, name: "Иван Иванов", group: "Группа A" },
  { id: 2, name: "Анна Смирнова", group: "Группа A" },
  { id: 3, name: "Петр Петров", group: "Группа A" },
  { id: 4, name: "Елена Кузнецова", group: "Группа B" },
  { id: 5, name: "Сергей Лебедев", group: "Группа B" },
  { id: 6, name: "Мария Воронцова", group: "Группа B" },
  { id: 7, name: "Алексей Мельников", group: "Группа C" },
  { id: 8, name: "Ольга Павлова", group: "Группа C" },
  { id: 9, name: "Дмитрий Егоров", group: "Группа C" },
  { id: 10, name: "Юлия Соколова", group: "Группа C" },
  { id: 11, name: "Никита Савельев", group: "Группа D" },
  { id: 12, name: "Татьяна Романова", group: "Группа D" },
  { id: 13, name: "Артем Белов", group: "Группа D" },
  { id: 14, name: "Ирина Федорова", group: "Группа D" },
  { id: 15, name: "Максим Зайцев", group: "Группа E" },
  { id: 16, name: "Наталья Григорьева", group: "Группа E" },
  { id: 17, name: "Олег Сидоров", group: "Группа E" },
  { id: 18, name: "Екатерина Морозова", group: "Группа E" },
  { id: 19, name: "Владимир Шестаков", group: "Группа F" },
  { id: 20, name: "Алёна Крылова", group: "Группа F" },
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

  const handleCreateJournal = () => {
    if (!newJournal.title) return alert("Введите название журнала");

    const newEntry = {
      id: Date.now().toString(),
      ...newJournal,
      date: new Date().toISOString(),
      students: dummyPeople.map(p => ({
        name: p.name,
        group: p.group,
        mark: newJournal.attendees.includes(p.id),
      })),
    };

    setJournals([...journals, newEntry]);
    setNewJournal({ type: "meets", title: "", attendees: [] });
    setModalOpen(false);
    navigate("/admin/journal");
  };

  const filteredJournals = active === "all"
    ? journals
    : journals.filter(j => j.type === active);

  return (
    <div className="container">
      <div className="nav-container">
        <ul>
          {types.map(([type, name]) => (
            <li
              key={type}
              className={active === type ? "active" : ""}
              onClick={() => setActive(type)}
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
          {new Date(j.date).toLocaleString("ru-RU", {
            month: "long",
            year: "numeric"
          }).replace(/^./, (char) => char.toUpperCase())}
        </h4>
        <p className="subtitle">{j.title}</p>
      </div>
      
      <div className="journal-footer">
        <span className="date">{new Date(j.date).toLocaleDateString("ru-RU")}</span>
        <div className="buttons">
          <button className="btn-outline" onClick={() => navigate(`/admin/journals/${j.id}`, { state: j })}>Посмотреть</button>
          {/* <button className="btn-solid">Редактировать</button> */}
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
    onChange={(e) => setNewJournal({ ...newJournal, title: e.target.value })}
  />

  <select
    value={newJournal.type}
    onChange={(e) => setNewJournal({ ...newJournal, type: e.target.value })}
  >
    <option value="meets">Собрание</option>
    <option value="events">Мероприятие</option>
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
        {dummyPeople.map((person) => {
          const isPresent = newJournal.attendees.includes(person.id);
          return (
            <tr key={person.id}>
              <td>{person.name}</td>
              <td
                className="icon-cell"
                onClick={() => toggleAttendance(person.id)}
                style={{ cursor: 'pointer' }}
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
    <button className="save" onClick={handleCreateJournal}>Сохранить</button>
    <button className="cancel" onClick={() => setModalOpen(false)}>Отмена</button>
  </div>
    </Modal>

    </div>
  );
};

export default Journals;
