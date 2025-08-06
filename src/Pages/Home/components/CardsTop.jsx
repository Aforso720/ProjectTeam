import React from "react";
import { PersonContext } from "../../../context/PersonContext";
import Card from "../../../Elements/Card";
const CardsTop = () => {
  const { homePerson } = React.useContext(PersonContext);
  return (
    <>
      {homePerson.map((person) => (
        <li key={person.position}>
          <Card
            {...person}
            extraClass={person.position === 1 ? "WinnerCard" : ""}
          />
          {person.position === 1 && (
            <img src="/img/crown.png" className="KingTop" alt="Корона" />
          )}
        </li>
      ))}
    </>
  );
};

export default CardsTop;
