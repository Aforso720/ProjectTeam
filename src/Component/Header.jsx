import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router";
import NotificationBadge from "../Elements/NotificationBadge";
import { useNotifications } from "../context/NotificationContext";

const Header = ({ userActive, user }) => {
  const { pathname } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const burgerRef = useRef(null);
  const { unreadCount } = useNotifications();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.getElementById("menu-toggle").checked = false;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        burgerRef.current &&
        !burgerRef.current.contains(event.target)
      ) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  useEffect(() => {
    closeMenu();
  }, [pathname]);

  return (
    <header className="Header">
      <div className="logo-admin-container">
        <Link to={"/"}>
          <img alt="Logo" src="/img/Лого (2).webp" className="Logotip" />
        </Link>

        {user?.is_admin && (
          <Link to={"/admin/journal"} className="adminNav">
            <img
              src="/img/AdminIcon.webp"
              alt="AdminPanel"
              style={{ width: 30 }}
            />
          </Link>
        )}
      </div>

      <input
        type="checkbox"
        id="menu-toggle"
        className="menu-toggle"
        checked={isMenuOpen}
        onChange={toggleMenu}
      />

      <label htmlFor="menu-toggle" className="burger-button" ref={burgerRef}>
        <img src="/img/_Nav menu button.webp" alt="Menu" />
      </label>

      <ul className="navig" ref={menuRef}>
        <li className={pathname === "/" ? "active" : ""}>
          <Link to={"/"} onClick={closeMenu}>
            Главная
          </Link>
        </li>
        <li className={pathname === "/contests" ? "active" : ""}>
          <Link to={"/contests"} onClick={closeMenu}>
            Конкурсы
          </Link>
        </li>
        <li className={pathname === "/about-us" ? "active" : ""}>
          <Link to={"/about-us"} onClick={closeMenu}>
            О нас
          </Link>
        </li>
        <li className={pathname === "/members" ? "active" : ""}>
          <Link to={"/members"} onClick={closeMenu}>
            Участники
          </Link>
        </li>

        <li
          className={`profile-item ${
            pathname === "/profile" ? "expanded" : ""
          }`}
        >
          <Link to={"/profile"} onClick={closeMenu}>
            <img
              src={
                pathname === "/profile"
                  ? "/img/Group 78.png"
                  : "/img/profile-circle.svg"
              }
              alt="Profile"
            />
            {pathname === "/profile" && <span>Личный кабинет</span>}
            {pathname !== "/profile" && unreadCount > 0 && (
              <div className="profile-notification-badge">
                <NotificationBadge />
              </div>
            )}
          </Link>
        </li>
      </ul>
    </header>
  );
};

export default Header;
