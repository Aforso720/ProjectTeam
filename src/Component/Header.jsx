import React from 'react'
import { Link } from 'react-router'

const Header = () => {
  return (
    <header className='Header'>
        <img alt='Logo' src='img\logo.png' className='Logotip'/>
        <nav>
          <ul>
            <li className='active'>
               <Link to={'/'}>
                Главная
               </Link>
            </li>
            <li><Link to={'/contest'}>
                Конкурсы
               </Link></li>
            <li><Link to={'/about-us'}>
                О нас
               </Link></li>
            <li><Link to={'/participants'}>
                Участники
               </Link></li>
            <li><Link to={'/ratings'}>
                Рейтинг
               </Link></li>
            <li><Link to={'/profile'}>
                <img src='img\profile-circle.svg'/>
               </Link></li>
          </ul>
        </nav>
      </header>
  )
}

export default Header