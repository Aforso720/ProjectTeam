import React from 'react';
import style from './Card.module.scss';

const Card = ({name, image, position, group}) => {
    return (
        <div className={style.Card}>
            <img src={image} alt="Card"/>
            <span><b>{position}</b>st</span>
            <p className={style.CardName}>{name}</p>
            <p className={style.CardGroup}>{group}</p>
        </div>
    );
};

export default Card;
