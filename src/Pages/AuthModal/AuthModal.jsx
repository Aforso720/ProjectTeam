import React, { useState } from "react";
import "./AuthModal.scss";

const AuthModal = ({ onClose, handleLogin, loading, error }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!email.trim() || !password.trim()) {
    setLocalError("Пожалуйста, заполните все поля");
    return;
  }

  setLocalError("");
  const success = await handleLogin(email, password);

  if (success) {
    onClose(); 
  } else {
    setPassword("");
  }
};


  return (
    <div className="auth-modal">
      <div className="auth-modal__content">
        <button 
          className="auth-modal__close" 
          onClick={onClose} 
          aria-label="Закрыть"
          disabled={loading}
        >
          &times;
        </button>
        <div className="auth-modal__header">
          <h2>Вход в аккаунт</h2>
          <div className="auth-modal__divider"></div>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Введите ваш email"
              disabled={loading}
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
              disabled={loading}
            />
          </div>
          {(error || localError) && (
            <div className="error-message">{error || localError}</div>
          )}
          <button 
            type="submit" 
            className="auth-button" 
            disabled={loading}
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
