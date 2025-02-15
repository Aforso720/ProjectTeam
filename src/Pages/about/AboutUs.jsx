import React from "react";
import "./AboutUs.scss";

const AboutUs = () => {
    return (
        <section className="container">
            <div className="who-me">
                <div className="about">
                    <div className="circle-wrapper">
                        <img src="/img/whome.svg" className="one-img" alt="e"/>
                        <img src="/img/malik.svg" className="two-img" alt="f"/>
                    </div>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
                        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                        non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                </div>
            </div>
            <div className="we-doing">
                <div className="about">
                    <div className="paragraph">
                        <h2>Чем мы занимаемся?</h2>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                            labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                            laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
                            voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                            cupidatat
                            non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>
                    </div>
                    <div className="circle-wrapper">
                        <div className="one-img"></div>
                        <img src="/img/malik.svg" className="two-img" alt="e"/>
                    </div>
                </div>
            </div>
            <div className="contacts">
                <div className="about">
                    <div className="contacts container">
                        <h2>Контакты</h2>
                        <ul>
                            <li>Телефон:</li>
                            <li>E-mail:</li>
                            <li>Адрес:</li>
                        </ul>
                    </div>
                    <img src="/img/map.png" alt="f"/>
                </div>
            </div>
        </section>
    );
};

export default AboutUs;
