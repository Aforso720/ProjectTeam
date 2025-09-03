import React from "react";
import "./AboutUs.scss";

const AboutUs = () => {
  return (
    <section className="aboutPage">
      <div className="who-me">
        <div className="about">
          <div className="circle-wrapper">
            <img src="/img/whome.svg" className="one-img" alt="e" />
            <img src="/img/kot.jpg" className="two-img" alt="f" />
          </div>
          <p>
            Мы верим, что каждый проект начинается с грамотной заявки. Project
            Team занимается поиском перспективных мероприятий, оформлением
            документации и поддержкой инициатив, чтобы студенты ГГНТУ могли
            реализовать свой потенциал.
          </p>
        </div>
      </div>
      <div className="we-doing">
        <div className="about">
          <div className="paragraph">
            <h2>Чем мы занимаемся?</h2>
            <p>
              От грантов до стартапов — Project Team занимается подготовкой и
              подачей заявок на участие в конкурсах, фестивалях и
              образовательных программах. Наша цель — дать шанс каждому студенту
              проявить себя!
            </p>
          </div>
          <div className="circle-wrapper">
            <div className="one-img"></div>
            <img src="/img/kot.jpg" className="two-img" alt="e" />
          </div>
        </div>
      </div>
      <div className="contacts">
        <div className="about">
          <div className="infoAbout">
            <h2 style={{textAlign:"center"}}>Контакты</h2>
            <form>
              <div>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value="+7 (999) 999-99-99 "
                  readOnly
                />
              </div>

              <div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value="ProjectTeam@mail.com"
                  readOnly
                />
              </div>

              <div>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value="ул. Исаева 100 "
                  readOnly
                />
              </div>
            </form>
          </div>

          <div className="ifrMap">
            <h2>Где мы?</h2>
            <iframe
              title="Местоположения команды"
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1451.3945873813714!2d45.694475!3d43.3186726!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4051d3e1401a81b1%3A0x1292d18b30352e91!2zwqvQk9GA0L7Qt9C90LXQvdGB0LrQuNC5INCz0L7RgdGD0LTQsNGA0YHRgtCy0LXQvdC90YvQuSDQvdC10YTRgtGP0L3QvtC5INGC0LXRhdC90LjRh9C10YHQutC40Lkg0YPQvdC40LLQtdGA0YHQuNGC0LXRgiDQuNC80LXQvdC4INCw0LrQsNC00LXQvNC40LrQsCDQnC7QlC4g0JzQuNC70LvQuNC-0L3RidC40LrQvtCy0LDCuw!5e0!3m2!1sru!2suk!4v1740030382075!5m2!1sru!2suk"
              width="600"
              height="450"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
