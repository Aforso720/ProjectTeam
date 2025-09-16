import React, { useState, useCallback, useContext, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import Modal from "react-modal";
import axiosInstance from "../API/axiosInstance";
import { AuthContext } from "../context/AuthContext";

export const InviteProjectButton = ({ projectId, projectName }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const joinUrl = `${window.location.origin}/join/${projectId}`;
  const shareText = `Хочу пригласить тебя в проект ${projectName || ""}. Открой ссылку, чтобы присоединиться:`;

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: projectName ? `Приглашение в проект ${projectName}` : "Приглашение в проект",
          text: shareText,
          url: joinUrl,
        });
        return;
      }
      throw new Error("No Web Share API");
    } catch (error) {
      try {
        await navigator.clipboard.writeText(joinUrl);
      } catch (e) {
        // ignore clipboard errors
      }
      setIsModalOpen(true);
    }
  };

  const closeModal = () => setIsModalOpen(false);

  const openIntent = (url) => {
    window.open(url, "_blank");
  };

  return (
    <>
      <button onClick={handleShare} className="socModalButton">
        Поделиться приглашением
      </button>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            transform: "translate(-50%, -50%)",
            padding: "20px",
            maxWidth: "400px",
            width: "90%",
          },
          overlay: { backgroundColor: "rgba(0,0,0,0.5)" },
        }}
      >
        <h2>Приглашение</h2>
        <p>Ссылка скопирована в буфер обмена.</p>
        <input
          style={{ width: "100%", marginBottom: "10px" }}
          value={joinUrl}
          readOnly
          onFocus={(e) => e.target.select()}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <button
            onClick={() =>
              openIntent(`https://t.me/share/url?url=${encodeURIComponent(joinUrl)}&text=${encodeURIComponent(shareText)}`)
            }
          >
            Telegram
          </button>
          <button
            onClick={() =>
              openIntent(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + joinUrl)}`)
            }
          >
            WhatsApp
          </button>
          <button
            onClick={() =>
              openIntent(`https://vk.com/share.php?url=${encodeURIComponent(joinUrl)}&title=${encodeURIComponent(shareText)}`)
            }
          >
            VK
          </button>
          <button
            onClick={() =>
              openIntent(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(joinUrl)}`)
            }
          >
            Facebook
          </button>
          <button
            onClick={() =>
              openIntent(
                `mailto:?subject=${encodeURIComponent("Приглашение в проект")}&body=${encodeURIComponent(
                  shareText + "\n\n" + joinUrl
                )}`
              )
            }
          >
            Email
          </button>
        </div>
        <button onClick={closeModal} style={{ marginTop: "10px" }}>
          Закрыть
        </button>
      </Modal>
    </>
  );
};

export const JoinProjectPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const authContext = useContext(AuthContext);
  const isAuthenticated = authContext?.isAuthenticated;
  const setPendingJoinIntent = authContext?.setPendingJoinIntent;
  const [status, setStatus] = useState("idle");
  const [infoMessage, setInfoMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const joinAttemptRef = useRef(false);

  useEffect(() => {
    setErrorMessage("");
    setInfoMessage("");
    joinAttemptRef.current = false;
  }, [projectId]);

  const redirectToLogin = useCallback(() => {
    if (!projectId) {
      setErrorMessage("Приглашение недействительно или проект не найден");
      return;
    }

    const redirectTo = `/join/${projectId}`;
    if (typeof setPendingJoinIntent === "function") {
      setPendingJoinIntent({
        type: "join_project",
        projectId,
        redirectTo,
        createdAt: Date.now(),
      });
    }

    // JOIN: сохраняем маршрут и перенаправляем на авторизацию
    navigate(`/login?next=${encodeURIComponent(redirectTo)}`, {
      replace: true,
      state: { from: location },
    });
  }, [location, navigate, projectId, setPendingJoinIntent]);

  const handleJoinRequest = useCallback(async () => {
    if (!projectId) {
      setErrorMessage("Приглашение недействительно или проект не найден");
      return;
    }

    if (joinAttemptRef.current) return;
    joinAttemptRef.current = true;

    setStatus("loading");
    setErrorMessage("");
    setInfoMessage("Присоединяем к проекту…");

    let redirectAfterAuth = false;
    let openProfileAfter = false;

    try {
      // JOIN: обращаемся к серверу для вступления в проект
      await axiosInstance.post(`/projects/${projectId}/join`, {});
      setInfoMessage("Вы присоединились к проекту");
      if (typeof setPendingJoinIntent === "function") {
        setPendingJoinIntent(null);
      }
      localStorage.setItem("accountActiveTab", "MyEvents");
      openProfileAfter = true;
    } catch (err) {
      const statusCode = err?.response?.status;

      if (statusCode === 401 || statusCode === 403) {
        redirectAfterAuth = true;
        setInfoMessage("");
        if (typeof setPendingJoinIntent === "function") {
          setPendingJoinIntent({
            type: "join_project",
            projectId,
            redirectTo: `/join/${projectId}`,
            createdAt: Date.now(),
          });
        }
      } else if (statusCode === 404) {
        setErrorMessage("Приглашение недействительно или проект не найден");
      } else if (statusCode === 409) {
        setInfoMessage("Вы уже участвуете в проекте");
        if (typeof setPendingJoinIntent === "function") {
          setPendingJoinIntent(null);
        }
        openProfileAfter = true;
      } else {
        setErrorMessage(
          err?.response?.data?.message || "Не удалось присоединиться к проекту"
        );
      }
    } finally {
      setStatus("idle");
      joinAttemptRef.current = false;
    }

    if (redirectAfterAuth) {
      redirectToLogin();
      return;
    }

    if (openProfileAfter) {
      window.setTimeout(() => {
        navigate("/profile", { replace: true });
      }, 1500);
    }
  }, [navigate, projectId, redirectToLogin, setPendingJoinIntent]);

  useEffect(() => {
    if (!projectId) {
      setErrorMessage("Приглашение недействительно или проект не найден");
      return;
    }

    if (!isAuthenticated) {
      joinAttemptRef.current = false;
      redirectToLogin();
      return;
    }

    if (!joinAttemptRef.current) {
      // JOIN: авторизованный пользователь присоединяется автоматически
      handleJoinRequest();
    }
  }, [handleJoinRequest, isAuthenticated, projectId, redirectToLogin]);

  return (
    <div
      style={{
        padding: "32px 16px",
        textAlign: "center",
        maxWidth: 480,
        margin: "0 auto",
      }}
    >
      <h1 style={{ marginBottom: 12 }}>Присоединение к проекту</h1>
      <p style={{ marginBottom: 24 }}>ID проекта: {projectId || "—"}</p>
      {infoMessage && (
        <p style={{ color: "#4B1218", fontWeight: 600 }}>{infoMessage}</p>
      )}
      {errorMessage && (
        <p style={{ color: "#b42318", fontWeight: 600 }}>{errorMessage}</p>
      )}
      <div
        style={{
          marginTop: 24,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          alignItems: "center",
        }}
      >
        <button
          onClick={handleJoinRequest}
          disabled={status === "loading" || !isAuthenticated}
          style={{
            padding: "10px 20px",
            borderRadius: 12,
            border: "1.5px solid #4B1218",
            backgroundColor: status === "loading" ? "#f5f0f0" : "#4B1218",
            color: status === "loading" ? "#4B1218" : "#fff",
            fontWeight: 600,
            cursor: status === "loading" || !isAuthenticated ? "default" : "pointer",
            minWidth: 220,
          }}
        >
          {status === "loading"
            ? "Присоединяем к проекту…"
            : "Повторить попытку"}
        </button>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "8px 20px",
            borderRadius: 12,
            border: "1.5px solid #ccc",
            backgroundColor: "transparent",
            cursor: "pointer",
            minWidth: 220,
          }}
        >
          На главную
        </button>
      </div>
    </div>
  );
};

export default { InviteProjectButton, JoinProjectPage };
