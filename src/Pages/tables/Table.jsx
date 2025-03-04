import React from "react";
import "./Table.scss";
import {Link} from "react-router";

// const students = ;

const Table = () => {

    const {...props} = {journalName: "Журнал собраний", journalDate: "2025-02-26", students: [
            { name: "Иван Иванов", group: "Группа 101", mark: true },
            { name: "Петр Петров", group: "Группа 102", mark: false },
            { name: "Сидор Сидоров", group: "Группа 103", mark: true },
            { name: "Анна Смирнова", group: "Группа 104", mark: false },
            { name: "Мария Козлова", group: "Группа 105", mark: true },
            { name: "Анна Смирнова", group: "Группа 104", mark: false },
            { name: "Мария Козлова", group: "Группа 105", mark: true },
            { name: "Анна Смирнова", group: "Группа 104", mark: false },
            { name: "Мария Козлова", group: "Группа 105", mark: true },
            { name: "Анна Смирнова", group: "Группа 104", mark: false },
            { name: "Анна Смирнова", group: "Группа 104", mark: false },
            { name: "Мария Козлова", group: "Группа 105", mark: true },
            { name: "Анна Смирнова", group: "Группа 104", mark: false },
            { name: "Мария Козлова", group: "Группа 105", mark: true },
            { name: "Мария Козлова", group: "Группа 105", mark: true },
        ]}


    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        let options = { day: '2-digit', month: 'long', year: 'numeric' };
        let formattedDate = date.toLocaleDateString('ru-RU', options);

        let parts = formattedDate.split(' ');
        parts[1] = capitalize(parts[1]); // Делаем первую букву месяца заглавной

        return parts.join(' ');
    };

    return (
        <div className={"container"}>
            <div className={"nav-container"}>
                <Link to={"/admin/journals"} className={"arrow"}></Link>
                <p>
                    {props.journalName}
                </p>
                <p>
                    {formatDate(props.journalDate)}
                </p>
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
                    {props.students.map((student, index) => (
                        <tr key={index}>
                            <td className={"table-name"}>{student.name}</td>
                            <td className={"table-group"}>{student.group}</td>
                            <td className="mark">{student.mark ?
                                <img src="/img/was.png" alt="was"/>
                                : <img src="/img/wasNot.png" alt="was not"/>}</td>
                        </tr>))
                    }
                    </tbody>
                </table>
            </div>
        </div>

    )
};

export default Table;
