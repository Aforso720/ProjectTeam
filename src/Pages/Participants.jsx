import React from 'react'
import { MyContext } from "../App";

const Participants = () => {
    const {person} = React.useContext(MyContext)

    const formatName = (fullName) => {
        const maxLength = 12; 
        if (fullName.length <= maxLength) {
        return fullName; 
        }

        const parts = fullName.split(' ');
        if (parts.length < 2) {
        return fullName; 
        }

        const lastName = parts[0]; 
        const firstName = parts[1][0] + '.'; 
        const middleName = parts[2] ? parts[2][0] + '.' : ''; 

        return `${lastName} ${firstName} ${middleName}`.trim();
    };

    if(!person){
        <div>Загрузка!!!</div>
    }

    return (
        <div className='Participants'>
            <div className='supervisor'>
                <h2>Руководители</h2>
                <ul className='cardSupervisor'>
                    <li>
                        <img src='img\Mask group.png' alt=''/>
                        <h4>Соло тащер</h4>
                        <p>Секретарь</p>
                    </li>
                    <li>
                        <img src='img\Mask group.png' alt=''/>
                        <h4>Соло тащер</h4>
                        <p>Руководитель проектной команды</p>
                    </li>
                    <li>
                        <img src='img\Mask group.png' alt=''/>
                        <h4>Соло тащер</h4>
                        <p>Секретарь</p>
                    </li>
                </ul>
            </div>
            <div className='rating'>
                <h2>Лидеры рейтинга</h2>
                <ul>
                    {person.map((item, index) => (
                        <li className={`cardRating ${index >= 3 ? 'cardWithButton' : ''}`} key={index}>
                            <img className='imgRating' alt='' src={item.image} />
                            <div className='textCard'>
                                <p className='positionRating'><b>{item.position}</b>st</p>
                                <div className='textInfo'>
                                    <p className='textName'>
                                        {index < 3 ? formatName(item.name) : item.name}
                                    </p>
                                    <p className='textGroup'>{item.group}</p>
                                </div>
                                <span className='numRating'>{item.rating}</span>
                                {index >= 3 && <button className='detailsButton'>Подробнее</button>}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Participants