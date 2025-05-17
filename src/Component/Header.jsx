import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Header = ({ setUserActive }) => {
    const { pathname } = useLocation()
    
    return (
        <header className='Header'>
            <div className="logo-admin-container">
                <Link to={'/'}>
                    <img alt='Logo' src='img\Лого (2).png' className='Logotip'/>
                </Link>
                
                <Link to={'/admin/journal'} className='adminNav'>
                    <span className="admin-text">Админка</span>
                </Link>
            </div>

            <input type="checkbox" id="menu-toggle" className="menu-toggle" />
            
            <label htmlFor="menu-toggle" className="burger-button">
                <img src="/img/_Nav menu button.png" alt="Menu" />
            </label>

            <ul className='navig'>
                <li className={pathname === '/' ? "active" : ""}>
                    <Link to={'/'}>Главная</Link>
                </li>
                <li className={pathname === '/contests' ? "active" : ""}>
                    <Link to={'/contests'}>Конкурсы</Link>
                </li>
                <li className={pathname === '/about-us' ? "active" : ""}>
                    <Link to={'/about-us'}>О нас</Link>
                </li>
                <li className={pathname === '/members' ? "active" : ""}>
                    <Link to={'/members'}>Участники</Link>
                </li>
                <li className={`profile-item ${pathname === '/profile' ? "expanded" : ""}`}>
                    <Link to={'/profile'}>
                        <img src={pathname === '/profile' ? "img/Group 78.png" : "img/profile-circle.svg"} alt="Profile" />
                        {pathname === '/profile' && <span>Личный кабинет</span>}
                    </Link>
                </li>
            </ul>
        </header>
    )
}

export default Header