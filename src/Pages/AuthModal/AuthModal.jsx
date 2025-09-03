import "./AuthModal.scss";
import { useForm } from "react-hook-form";

const AuthModal = ({ onClose, handleLogin, loading, error }) => {
  const { register, handleSubmit, formState, reset } = useForm({
    mode: "onChange",
  });

  const emailError = formState.errors["email"]?.message;
  const passwordError = formState.errors["password"]?.message;

  const logAuthSubmit = async (data) => {
    await handleLogin(data.email , data.password)
    reset();
    onClose();
  };

  return (
    <article className="auth-modal">
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
        <form onSubmit={handleSubmit(logAuthSubmit)} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              // value={email}
              placeholder="Введите ваш email"
              disabled={loading}
              {...register('email',{
                required: "Это поле обязательно",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i,
                  message: "Email некорректен",
                },
              })}
            />
          </div>
          {emailError && <div className="error-message">{emailError}</div>}
          <div className="form-group">
            <label htmlFor="password">Пароль:</label>
            <input
              id="password"
              type="password"
              // value={password}
              placeholder="Введите ваш пароль"
              disabled={loading}
              {...register("password", {
                required: "Это поле обязательно",
                pattern: {
                  value: /^.{6,}$/,
                  message: "Пароль должен быть не короче 6 символов",
                },
              })}
            />
          </div>
          {passwordError && (
            <div className="error-message">{passwordError}</div>
          )}
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Вход..." : "Войти"}
          </button>
        </form>
      </div>
    </article>
  );
};

export default AuthModal;
