import React from 'react';
import style from './Card.module.scss';

const Card = ({first_name, image, position, group}) => {
    return (
        <div className={style.Card}>
            <img src='img/kot.jpg' alt="Card"/>
            <span><b>{position}</b>st</span>
            <p className={style.CardName}>{first_name}</p>
            <p className={style.CardGroup}>ПИ-22-1</p>
        </div>
    );
};

export default Card;
