import React from "react";
import "./AboutUs.scss";

const AboutUs = () => {
    return (
        <section className="container">
            <div className="who-me">
                <div className="about">
                    <div className="circle-wrapper">
                        <img src="/img/whome.svg" className="one-img" alt="e"/>
                        <img src="/img/kot.jpg" className="two-img" alt="f"/>
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
                        <img src="/img/kot.jpg" className="two-img" alt="e"/>
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
                    <div className="ifrMap">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1451.3945873813714!2d45.694475!3d43.3186726!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4051d3e1401a81b1%3A0x1292d18b30352e91!2zwqvQk9GA0L7Qt9C90LXQvdGB0LrQuNC5INCz0L7RgdGD0LTQsNGA0YHRgtCy0LXQvdC90YvQuSDQvdC10YTRgtGP0L3QvtC5INGC0LXRhdC90LjRh9C10YHQutC40Lkg0YPQvdC40LLQtdGA0YHQuNGC0LXRgiDQuNC80LXQvdC4INCw0LrQsNC00LXQvNC40LrQsCDQnC7QlC4g0JzQuNC70LvQuNC-0L3RidC40LrQvtCy0LDCuw!5e0!3m2!1sru!2suk!4v1740030382075!5m2!1sru!2suk" width="600" height="450" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"/>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutUs;
