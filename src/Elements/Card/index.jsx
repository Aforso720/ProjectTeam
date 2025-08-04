import React from "react";
import style from "./Card.module.scss";

const Card = ({ first_name, image, position, extraClass, group }) => {
  return (
    <article className={`${style.Card} ${extraClass}`}>
      <img src="img/kot.jpg" alt="Card" />
      <span>
        <b>{position}</b>st
      </span>
      <div className={style.CardInfo}>
        <p className={style.CardName}>{first_name}</p>
        <p className={style.CardGroup}>{group}</p>
      </div>
    </article>
  );
};

export default Card;
