import React from "react";
import { useLocation } from "react-router";
import "./HeaderAdmin.scss";
import {Link} from "react-router";

const HeaderAdmin = () => {

    const {pathname } = useLocation();
    const test = [
        ["Журнал", "journal"],
        ["Активности", "contest"],
        ["Участники", "managing"]
    ]

    return (
        <header>
            <section className="back-container">
                <img src="/img/logoAdmin.png" alt="logo"/>
                <Link to='/'>
                <button>Вернуться на главную</button>
                </Link>
            </section>

            <section className={"active-container"}>
                <ul>
                    {
                        test.map(([name,path]) => {
                            return (
                                <li className={pathname.includes("/admin/" + path) ? "active" : ""}>
                                    <Link to={"/admin/"+ path}>
                                        {name}
                                    </Link>
                                </li>
                            )
                    })
                    }
                </ul>
            </section>
        </header>
    );
};

export default HeaderAdmin;