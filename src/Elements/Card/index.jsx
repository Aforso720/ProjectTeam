import React from 'react';
import style from './Card.module.scss';

const Card = () => {
  return (
    <div className={style.Card}>
      <img className={style.CardImg} src='img\Mask group.png' alt="Card" />
      <span><b>1</b>st</span>
      <p className={style.CardName}>Легенда Доты 2 и КС 2</p>
      <p className={style.CardGroup}>Почему то всегда 2</p>
    </div>
  );
};

export default Card;
