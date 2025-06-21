import React from "react";
import { useLocation, Link } from "react-router-dom";
import "./Table.scss";

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { day: '2-digit', month: 'long', year: 'numeric' };
  const parts = date.toLocaleDateString('ru-RU', options).split(' ');
  parts[1] = capitalize(parts[1]);
  return parts.join(' ');
};

const JournalView = () => {
  const { state } = useLocation();

  if (!state) return <div>Журнал не найден</div>;

  return (
    <div className="container">
      <div className="nav-container">
        <Link to="/admin/journal" className="arrow"></Link>
        <p>{state.title}</p>
        <p>{formatDate(state.date)}</p>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ФИО</th>
              <th>Группа</th>
              <th className="mark">Отметка</th>
            </tr>
          </thead>
            <tbody>
              {state.students.map((student, index) => (
                <tr key={index}>
                  <td>{student.name}</td>
                  <td>{student.group}</td>
                  <td className="mark">
                    {student.mark
                      ? <img src="/img/was.png" alt="Присутствовал" />
                      : <img src="/img/wasNot.png" alt="Отсутствовал" />
                    }
                  </td>
                </tr>
              ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default JournalView;
