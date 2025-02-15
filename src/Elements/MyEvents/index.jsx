import React from 'react'
import style from "./MyEvents.module.scss"

const MyEvents = () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8]

    return (
        <div className={style.MyEvents}>
            <div className={style.addedEvent}>
                <img src='/img/carbon_ibm-cloud-projects.png' alt='img'/>
                <button>Добавить проект</button>
            </div>

            {arr.map(item => (

                <div className={style.card} key={item.id}>
                    <img src="/img/2.png" alt="Проект" className={style.cardImage}/>
                    <div className={style.cardContent}>
                        <h3 className={style.cardTitle}>Название проекта</h3>
                        <p className={style.cardDescription}>Краткое описание</p>
                        <button className={style.cardButton}>Подробнее</button>
                    </div>
                </div>

            ))}

        </div>
    )
}

export default MyEvents