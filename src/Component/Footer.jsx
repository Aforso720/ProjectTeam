import React from 'react'

const Footer = () => {
    return (
        <footer className='Footer'>
            <div className='LogoFoot'>
                <img alt={'logo'} src='/img/logoFoot.svg'/>
            </div>
            <div className='inform'>
                <div className='redLine'></div>
                <ul>
                    <li className='UlH'>Сведения</li>
                    <li>Сайт ГГНТУ</li>
                    <li>Сайт ИЦЭиТп</li>
                </ul>
                <ul>
                    <li className='UlH'> Контакты</li>
                    <li>
                        <img alt={'phone'} src='/img/phone num.svg'/>
                        Контакты
                    </li>
                    <li><img alt={'email'} src='/img/email.svg'/></li>
                    <li><img alt={'location'} src='/img/loc.svg'/>
                        пр. Х. Исаева, 100, Грозный
                    </li>
                </ul>
                <ul>
                    <li className='UlH'>Социальные сети</li>
                    <li><img alt={'telegram'} src='/img/tg logo.svg'/> @projectteamiceitp</li>
                    <li><img alt={'instagram'} src='/img/Instagram.svg'/> @project_team_iceitp</li>
                </ul>
            </div>
            <div className='madeIn'>
                <p>© 2025 Made by IMPULSE</p>
            </div>
        </footer>
    )
}

export default Footer