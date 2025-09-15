import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import Modal from "react-modal";
import axiosInstance from "../API/axiosInstance";

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
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleJoin = async () => {
    setLoading(true);
    setError("");
    try {
      await axiosInstance.post(`/projects/${projectId}/join`, {});
      setMessage("Готово!");
      setTimeout(() => {
        navigate(`/projects/${projectId}`);
      }, 1500);
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) {
        navigate(`/login?next=/join/${projectId}`);
      } else {
        setError(err.response?.data?.message || "Не удалось вступить в проект");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Присоединиться к проекту</h1>
      <p>ID проекта: {projectId}</p>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message ? (
        <p>{message}</p>
      ) : (
        <button
          onClick={handleJoin}
          disabled={loading}
          style={{ padding: "8px 16px" }}
        >
          {loading ? "Загрузка..." : "Вступить в проект"}
        </button>
      )}
      <div style={{ marginTop: "20px" }}>
        <button onClick={() => navigate(-1)} style={{ padding: "6px 12px" }}>
          Назад
        </button>
      </div>
    </div>
  );
};

export default { InviteProjectButton, JoinProjectPage };
