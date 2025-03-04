import React, {useState} from 'react';
import "./Journals.scss"

const Journals = () => {
    const [active, setActive] = useState("all")
    const types = [
        ["all", "Все"],
        ["meets", "Журнал собраний"],
        ["events", "Журнал мероприятий"]
    ]

    return (
        <div className={"container"}>
            <div className={"nav-container"}>
                <ul>
                    {
                        types.map(([type, name], index) => {
                            return (
                                <li key={index} className={type ? active : ""}>
                                    {name}
                                </li>
                            )
                        })
                    }

                </ul>
            </div>

            <div className={"journals-container"}>
                asdasd
            </div>
        </div>
    );
};

export default Journals;