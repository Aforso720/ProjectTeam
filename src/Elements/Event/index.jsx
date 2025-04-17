import React from 'react'
import style from './Event.module.scss'

const Event = ({id, image, description , contMyEvent }) => {
    return (
        <div className={`${style.swiperSlide} ${contMyEvent}`} key={id}>
            <img
                src={image}
                alt="Slide 1"
                className={style.SliderImg}
            />
            <div className={style.textOverlay}>
                <p>{description}</p>
            </div>
        </div>
    )
}

export default Event