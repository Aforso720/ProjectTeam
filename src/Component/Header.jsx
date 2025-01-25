import React from 'react'
import { Link,useLocation } from 'react-router'

const Header = () => {
  const {pathname} = useLocation();
  return (
    <header className='Header'>
        <img alt='Logo' src='img\logo.png' className='Logotip'/>
          <ul className='navig'>
            <li className={pathname === '/' ? "active":""}>
               <Link to={'/'}>
                Главная
               </Link>
            </li>
            <li className={pathname === '/contests' ? "active":""}>
              <Link to={'/contests'}>
                Конкурсы
               </Link></li>
            <li className={pathname === '/about-us' ? "active":""}>
              <Link to={'/about-us'}>
                О нас
               </Link></li>
            <li className={pathname === '/participants' ? "active":""}>
              <Link to={'/participants'}>
                Участники
               </Link></li>
            <li className={pathname === '/profile' ? "active":""}>
              <Link to={'/profile'}>
                <img src='img\profile-circle.svg'/>
               </Link></li>
          </ul>
      </header>
  )
}

export default Header