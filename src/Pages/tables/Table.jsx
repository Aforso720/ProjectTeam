import { useLocation, Link } from "react-router";
import "./Table.scss";

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { day: '2-digit', month: 'long', year: 'numeric' };
  const parts = date.toLocaleDateString('ru-RU', options).split(' ');
  parts[1] = capitalize(parts[1]);
  return parts.join(' ');
};

const translateType = (type) => {
  switch (type) {
    case "event":
      return "Мероприятие";
    default :
      return "Собрание";
  }
};

const Table = () => {
  const { state } = useLocation();

  if (!state) return <div>Журнал не найден</div>;

  const { title, date, type, students } = state;

  return (
    <section className="journal-container">
      <header className="journal-header">
        <Link to="/admin/journal" className="journal-back-arrow" aria-label="Назад к списку журналов" />
        <div className="journal-header-info">
          <p className="journal-title">{title}</p>
          <p className="journal-type">{translateType(type)}</p>
          <p className="journal-date">{formatDate(date)}</p>
        </div>
      </header>

      <div className="journal-table-wrapper">
        <table>
          <thead>
            <tr>
              <th className="student-name">ФИО</th>
              <th className="student-group">Группа</th>
              <th className="attendance-mark">Отметка</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={index}>
                <td>{student.name}</td>
                <td>{student.group}</td>
                <td className="attendance-mark">
                  <img
                    src={student.mark ? "/img/was.png" : "/img/wasNot.png"}
                    alt={student.mark ? "Присутствовал" : "Отсутствовал"}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Table;
