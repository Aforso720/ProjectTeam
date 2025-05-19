import React, { useState, useContext } from "react";
import { MyContext } from "../../App";
import { useNavigate } from "react-router-dom";
import "./AuthModal.scss";

const AuthModal = ({ onClose }) => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setUserId, setUserActive } = useContext(MyContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!login || !password) {
      setError("Пожалуйста, заполните все поля");
      return;
    }

    if (login === "admin" && password === "admin") {
      setUserId(1);
      setUserActive(true);
      navigate("/profile");
    } else {
      setError("Неверный логин или пароль");
    }
  };

  return (
    <div className="auth-modal">
      <div className="auth-modal__content">
        <button className="auth-modal__close" onClick={onClose} aria-label="Закрыть">
          &times;
        </button>
        <div className="auth-modal__header">
          <h2>Вход в аккаунт</h2>
          <div className="auth-modal__divider"></div>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="login">Логин:</label>
            <input
              id="login"
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="Введите ваш логин"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Пароль:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите ваш пароль"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="auth-button">
            Войти
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;