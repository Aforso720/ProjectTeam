import React from "react";
import usePerson from "../../../API/usePerson";
import Card from "../../../Elements/Card";
const CardsTop = () => {
  const { person: homePerson } = usePerson({ amount: 3});
  
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
