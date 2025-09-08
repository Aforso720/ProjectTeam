import React from 'react'
import { AuthContext } from '../../../context/AuthContext'
import Slider from '../../../Elements/Slider';

const EventsSectionHome = () => {
    const [isActive, setIsActive] = React.useState("Активные конкурсы");
    const {isAuthenticated} = React.useContext(AuthContext)

  return (
    <section className="Events">
        {isAuthenticated && (
          <div className="myContestsMobile">
            <div className="mobileHeader">Мои конкурсы</div>
            <div className="sliderMyContests">
              <Slider eventCategory='myProject' />
            </div>
          </div>
        )}

        <ul className="stateEvents">
          <li
            className={`stateEvent ${
              isActive === "Активные конкурсы" ? "active" : ""
            }`}
            onClick={() => setIsActive("Активные конкурсы")}
          >
            <span>Активные конкурсы</span>
          </li>
          {isAuthenticated && (
            <li
              className={`stateEvent myContestsDesktop ${
                isActive === "Мои конкурсы" ? "active" : ""
              }`}
              onClick={() => setIsActive("Мои конкурсы")}
            >
              <span>Мои конкурсы</span>
            </li>
          )}
          <li
            className={`stateEvent ${
              isActive === "Завершенные конкурсы" ? "active" : ""
            }`}
            onClick={() => setIsActive("Завершенные конкурсы")}
          >
            <span>Завершенные конкурсы</span>
          </li>
        </ul>
        <div className="sliderHome">
          <Slider eventCategory={isActive} />
        </div>
      </section>
  )
}

export default EventsSectionHome
