import React, { useContext, useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import InputField from "../../utils/InputField";
import "./LoginPage.scss";
import Seo from "../../components/Seo/Seo";

const LoginPage = () => {
  const authContext = useContext(AuthContext);
  const login = authContext?.login;
  const isAuthenticated = authContext?.isAuthenticated;
  const pendingJoinIntent = authContext?.pendingJoinIntent;

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const nextParam = searchParams.get("next");

  const { register, handleSubmit, formState, reset } = useForm({
    mode: "onChange",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = useCallback(
    async (data) => {
      if (!login) return;
      setLoading(true);
      setError("");
      const success = await login(data.email, data.password);
      setLoading(false);
      if (!success) {
        setError("Не удалось войти. Проверьте данные и попробуйте снова.");
        return;
      }
      reset();
    },
    [login, reset]
  );

  useEffect(() => {
    if (!isAuthenticated) return;

    const redirectTarget =
      pendingJoinIntent?.redirectTo ||
      (nextParam && nextParam.startsWith("/") ? nextParam : null);

    if (redirectTarget) {
      navigate(redirectTarget, { replace: true });
    } else {
      navigate("/profile", { replace: true });
    }
  }, [
    isAuthenticated,
    navigate,
    nextParam,
    pendingJoinIntent?.redirectTo,
  ]);

  const emailError = formState.errors?.email?.message;
  const passwordError = formState.errors?.password?.message;

  return (
    <>
      <Seo
        title="Вход в Project Team"
        description="Авторизуйтесь, чтобы управлять проектами и участвовать в конкурсах Project Team."
        canonicalPath="/login"
        ogTitle="Вход в Project Team"
        ogDescription="Авторизация для участников команды Project Team."
        ogImage="/img/LogoFoot.webp"
        ogImageAlt="Логотип Project Team"
        robots="noindex, nofollow"
      />
      <section className="login-page">
        <div className="login-card" aria-live="polite">
          <h1>Вход</h1>
          <p className="login-subtitle">
            Введите свои учетные данные, чтобы продолжить работу с платформой.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="login-form">
            <InputField
              label="Email"
              name="email"
              type="email"
              placeholder="example@domain.com"
              disabled={loading}
              register={register}
              validation={{
                required: "Это поле обязательно",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
                  message: "Email некорректен",
                },
              }}
              error={emailError}
            />

            <InputField
              label="Пароль"
              name="password"
              type="password"
              placeholder="Введите пароль"
              disabled={loading}
              register={register}
              validation={{
                required: "Это поле обязательно",
                minLength: {
                  value: 6,
                  message: "Пароль должен быть не короче 6 символов",
                },
              }}
              error={passwordError}
            />

            {error && <div className="login-error">{error}</div>}

            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? "Вход..." : "Войти"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default LoginPage;
