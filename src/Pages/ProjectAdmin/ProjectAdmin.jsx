import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "./ProjectAdmin.scss";
import axiosInstance from "../../API/axiosInstance";
import usePerson from "../../API/usePerson";
import { useForm } from "react-hook-form";
import InputField from "../../utils/InputField";

Modal.setAppElement("#root");

const ALLOWED_STATUS = ["active", "completed"];

const toInputDate = (d) => {
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const toServerDate = (input) => (input ? `${input} 00:00:00` : "");

const ProjectAdmin = () => {
  const { person } = usePerson();

  const initialState = {
    name: "",
    description: "",
    previewImage: null,
    certificate: null,
    status: "active",
    startDate: toInputDate(new Date()),
    endDate: toInputDate(new Date()),
    participants: [],
  };

  const [allProjects, setAllProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const projectsPerPage = 5;
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [projectData, setProjectData] = useState(initialState);
  const [deletingId, setDeletingId] = useState(null);
  const [approvingId, setApprovingId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isParticipantsDropdownOpen, setIsParticipantsDropdownOpen] =
    useState(false);

  const {
    register,
    handleSubmit: rhfHandleSubmit,
    formState,
  } = useForm({ mode: "onChange" });
  const nameError = formState.errors["name"]?.message;
  const startDateError = formState.errors["startDate"]?.message;
  const endDateError = formState.errors["endDate"]?.message;

  const toggleParticipant = (userId) => {
    setProjectData((prev) => {
      const isSelected = prev.participants.includes(userId);
      if (isSelected) {
        return {
          ...prev,
          participants: prev.participants.filter((id) => id !== userId),
        };
      } else {
        return {
          ...prev,
          participants: [...prev.participants, userId],
        };
      }
    });
  };

  const removeParticipant = (userId, e) => {
    e.stopPropagation();
    setProjectData((prev) => ({
      ...prev,
      participants: prev.participants.filter((id) => id !== userId),
    }));
  };

  const filteredUsers = person.filter((user) =>
    `${user.first_name} ${user.last_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const resetProjectData = () => {
    setProjectData({
      ...initialState,
      startDate: toInputDate(new Date()),
      endDate: toInputDate(new Date()),
    });
    setSelectedFile(null);
    setFilePreview(null);
  };

  const fetchAllProjects = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/projects?per_page=100");
      setAllProjects(response.data.data);
      applyFilter(filter, response.data.data);
    } catch (err) {
      console.error("Ошибка загрузки проектов:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilter = (filterType, projects = allProjects) => {
    let filtered = projects;

    if (filterType === "approved") {
      filtered = projects.filter((project) => project.is_approved);
    } else if (filterType === "pending") {
      filtered = projects.filter((project) => !project.is_approved);
    }

    setFilteredProjects(filtered);
    setTotalPages(Math.ceil(filtered.length / projectsPerPage));
    setCurrentPage(1);
  };

  const getCurrentPageProjects = () => {
    const startIndex = (currentPage - 1) * projectsPerPage;
    return filteredProjects.slice(startIndex, startIndex + projectsPerPage);
  };

  useEffect(() => {
    fetchAllProjects();
  }, []);

  useEffect(() => {
    applyFilter(filter);
  }, [filter, allProjects]);

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Удалить проект?")) return;
    try {
      setDeletingId(id);
      await axiosInstance.delete(`/projects/${id}`);
      await fetchAllProjects();
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleApproveProject = async (id) => {
    try {
      setApprovingId(id);
      await axiosInstance.post(`/projects/${id}/approve`);
      await fetchAllProjects();
    } catch (err) {
      console.error("Ошибка подтверждения проекта:", err);
    } finally {
      setApprovingId(null);
    }
  };

  const handleRejectProject = async (id) => {
    if (!window.confirm("Отклонить проект?")) return;
    try {
      setRejectingId(id);
      await axiosInstance.post(`/projects/${id}/reject`);
      await fetchAllProjects();
    } catch (err) {
      console.error("Ошибка отклонения проекта:", err);
    } finally {
      setRejectingId(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setProjectData((prev) => ({ ...prev, previewImage: file }));

      const reader = new FileReader();
      reader.onload = (e) => setFilePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleEditProject = (project) => {
    setCurrentProject(project);
    setIsEditMode(true);
    setIsViewModalOpen(true);
    setProjectData({
      name: project.name,
      description: project.description,
      previewImage: null,
      certificate: null,
      status: ALLOWED_STATUS.includes(project.status)
        ? project.status
        : "active",
      startDate: project.start_date.substring(0, 10),
      endDate: project.end_date.substring(0, 10),
      participants: project.participants || [],
    });
    setFilePreview(project.preview_image);
  };

  const handleViewProject = (project) => {
    setCurrentProject(project);
    setIsViewModalOpen(true);
    setIsEditMode(false);
  };

  const createProject = async () => {
    try {
      const formData = new FormData();

      formData.append("name", projectData.name);
      formData.append("description", projectData.description);
      formData.append("status", projectData.status);
      formData.append("start_date", toServerDate(projectData.startDate));
      formData.append("end_date", toServerDate(projectData.endDate));

      projectData.participants.forEach((participantId) => {
        formData.append("participants[]", participantId);
      });

      if (projectData.previewImage) {
        formData.append("preview_image", projectData.previewImage);
      }
      if (projectData.certificate) {
        formData.append("certificate", projectData.certificate);
      }

      await axiosInstance.post("/projects", formData);
      await fetchAllProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const updateProject = async () => {
    try {
      const formData = new FormData();

      formData.append("name", projectData.name);
      formData.append("description", projectData.description);
      formData.append("status", projectData.status);
      formData.append("start_date", toServerDate(projectData.startDate));
      formData.append("end_date", toServerDate(projectData.endDate));
      formData.append("_method", "PUT");

      projectData.participants.forEach((participantId) => {
        formData.append("participants[]", participantId);
      });

      if (projectData.previewImage instanceof File) {
        formData.append("preview_image", projectData.previewImage);
      }
      if (projectData.certificate instanceof File) {
        formData.append("certificate", projectData.certificate);
      }

      await axiosInstance.post(`/projects/${currentProject.id}`, formData);
      await fetchAllProjects();
      setIsViewModalOpen(false);
      setIsEditMode(false);
      resetProjectData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleFormSubmit = async () => {
    if (isEditMode) await updateProject();
    else await createProject();

    setIsModalOpen(false);
    setIsViewModalOpen(false);
    setIsEditMode(false);
    resetProjectData();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsViewModalOpen(false);
    setIsEditMode(false);
    resetProjectData();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdown = document.querySelector(".participants-dropdown");
      const selector = document.querySelector(".selected-participants");

      if (
        dropdown &&
        selector &&
        !dropdown.contains(event.target) &&
        !selector.contains(event.target)
      ) {
        setIsParticipantsDropdownOpen(false);
      }
    };

    if (isParticipantsDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isParticipantsDropdownOpen]);

  const approvedCount = allProjects.filter(p => p.is_approved).length;
  const pendingCount = allProjects.filter(p => !p.is_approved).length;

  return (
    <section className="project-admin">
        <div className="projects-filter">
          <button
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            Все проекты ({allProjects.length})
          </button>
          <button
            className={`filter-btn ${filter === "approved" ? "active" : ""}`}
            onClick={() => setFilter("approved")}
          >
            Подтвержденные ({approvedCount})
          </button>
          <button
            className={`filter-btn ${filter === "pending" ? "active" : ""}`}
            onClick={() => setFilter("pending")}
          >
            Ожидающие ({pendingCount})
          </button>
        </div>
      <div className="project-list">

        <div
          className="addProject"
          onClick={() => {
            resetProjectData();
            setIsModalOpen(true);
            setIsEditMode(false);
          }}
        >
          <img src="/img/adminAddJournal.png" alt="" />
          <div>Добавить проект</div>
        </div>

        {isLoading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Загрузка проектов...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="no-projects">
            <img src="/img/empty-state.svg" alt="Нет проектов" />
            <h3>Проекты не найдены</h3>
            <p>
              {filter === 'all' 
                ? 'Пока нет ни одного проекта' 
                : filter === 'approved' 
                ? 'Нет подтвержденных проектов' 
                : 'Нет проектов, ожидающих подтверждения'}
            </p>
          </div>
        ) : (
          getCurrentPageProjects().map((project, index) => {
            const creator = person.find((p) => p.id === project.user_id);
            const isApproved = project.is_approved;
            const isPendingApproval = !isApproved;

            return (
              <div
                key={project.id}
                className={`project-card ${
                  isPendingApproval ? "pending-approval" : ""
                }`}
              >
                <button
                  className="project-delete"
                  onClick={() => handleDeleteProject(project.id)}
                  disabled={deletingId === project.id}
                >
                  <img src="/img/DeleteCor.svg" alt="Удалить" />
                </button>
                <div
                  className="project-image"
                  style={{ backgroundImage: `url(${project.preview_image})` }}
                />
                <div className="project-details">
                  <h3>{project.name}</h3>
                  {creator && (
                    <p className="creator">
                      Создатель: {creator.first_name} {creator.last_name}
                    </p>
                  )}
                  {isPendingApproval && (
                    <div className="approval-status">
                      ⏳ Ожидает подтверждения
                    </div>
                  )}
                  <div className="project-actions">
                    <button onClick={() => handleViewProject(project)}>
                      Посмотреть
                    </button>

                    {isPendingApproval ? (
                      <>
                        <button
                          onClick={() => handleApproveProject(project.id)}
                          disabled={approvingId === project.id}
                          className="approve-btn"
                        >
                          {approvingId === project.id
                            ? "Подтверждение..."
                            : "Подтвердить"}
                        </button>
                        <button
                          onClick={() => handleRejectProject(project.id)}
                          disabled={rejectingId === project.id}
                          className="reject-btn"
                        >
                          {rejectingId === project.id
                            ? "Отклонение..."
                            : "Отклонить"}
                        </button>
                      </>
                    ) : (
                      <button onClick={() => handleEditProject(project)}>
                        Редактировать
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {totalPages > 1 && (
        <ul className="paginationProject">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <li
              key={page}
              className={currentPage === page ? "active_page" : ""}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </li>
          ))}
        </ul>
      )}

      <Modal
        isOpen={isModalOpen || isViewModalOpen}
        onRequestClose={closeModal}
        className="project-modal"
        overlayClassName="project-modal-overlay"
      >
        <div className="modal-header">
          <h2>
            {isEditMode
              ? "Редактирование проекта"
              : isModalOpen
              ? "Создание проекта"
              : "Просмотр проекта"}
          </h2>
          <button className="modal-close" onClick={closeModal}>
            ×
          </button>
        </div>

        <div className="modal-content">
          {isEditMode || isModalOpen ? (
            <form onSubmit={rhfHandleSubmit(handleFormSubmit)} className="project-form">
              <div className="form-grid">
                <div className="form-section">
                  <label className="form-label">
                    <span className="label-text">Название проекта *</span>
                    <InputField
                      type="text"
                      name="name"
                      value={projectData.name}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Введите название проекта"
                      register={register}
                      validation={{ required: "Введите название" }}
                      error={nameError}
                    />
                  </label>
                </div>

                <div className="form-section">
                  <label className="form-label">
                    <span className="label-text">Описание *</span>
                    <textarea
                      name="description"
                      value={projectData.description}
                      onChange={handleInputChange}
                      rows="4"
                      className="form-textarea"
                      placeholder="Опишите детали проекта..."
                      required
                    />
                  </label>
                </div>

                <div className="form-section">
                  <label className="form-label">
                    <span className="label-text">Превью изображение</span>
                    <div className="file-upload">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="file-input"
                      />
                      <div className="file-preview">
                        {filePreview ? (
                          <img
                            src={filePreview}
                            alt="Превью"
                            className="preview-image"
                          />
                        ) : (
                          <div className="file-placeholder">
                            <span>+ Загрузить изображение</span>
                            <p>PNG, JPG до 5MB</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </label>
                </div>

                <div className="form-section">
                  <label className="form-label">
                    <span className="label-text">Статус *</span>
                    <select
                      name="status"
                      value={projectData.status}
                      onChange={handleInputChange}
                      className="form-select"
                      required
                    >
                      <option value="active">Активный</option>
                      <option value="completed">Завершённый</option>
                    </select>
                  </label>
                </div>

                <div className="form-section">
                  <label className="form-label">
                    <span className="label-text">Дата начала *</span>
                    <InputField
                      type="date"
                      name="startDate"
                      value={projectData.startDate}
                      onChange={handleInputChange}
                      className="form-input"
                      register={register}
                      validation={{
                        required: "Укажите дату",
                        validate: (value) => {
                          const y = new Date(value).getFullYear();
                          return (
                            y >= 1900 && y <= 2100 ||
                            "Год должен быть между 1900 и 2100"
                          );
                        },
                      }}
                      error={startDateError}
                      min="1900-01-01"
                      max="2100-12-31"
                    />
                  </label>
                </div>

                <div className="form-section">
                  <label className="form-label">
                    <span className="label-text">Дата окончания *</span>
                    <InputField
                      type="date"
                      name="endDate"
                      value={projectData.endDate}
                      onChange={handleInputChange}
                      className="form-input"
                      register={register}
                      validation={{
                        required: "Укажите дату",
                        validate: (value) => {
                          const y = new Date(value).getFullYear();
                          return (
                            y >= 1900 && y <= 2100 ||
                            "Год должен быть между 1900 и 2100"
                          );
                        },
                      }}
                      error={endDateError}
                      min="1900-01-01"
                      max="2100-12-31"
                    />
                  </label>
                </div>
              </div>

              <div className="form-section">
                <label className="form-label">
                  <span className="label-text">Участники проекта</span>

                  <div className="participants-selector">
                    <div
                      className="selected-participants"
                      onClick={() =>
                        setIsParticipantsDropdownOpen(
                          !isParticipantsDropdownOpen
                        )
                      }
                    >
                      {projectData.participants.length === 0 ? (
                        <span className="placeholder">
                          Выберите участников...
                        </span>
                      ) : (
                        <div className="participants-tags">
                          {projectData.participants.map((participantId) => {
                            const user = person.find(
                              (p) => p.id === participantId
                            );
                            return user ? (
                              <span
                                key={user.id}
                                className="participant-tag selected"
                              >
                                {user.first_name} {user.last_name}
                                <button
                                  type="button"
                                  onClick={(e) => removeParticipant(user.id, e)}
                                  className="remove-tag"
                                >
                                  ×
                                </button>
                              </span>
                            ) : null;
                          })}
                        </div>
                      )}
                      <span className="dropdown-arrow">▼</span>
                    </div>

                    {isParticipantsDropdownOpen && (
                      <div className="participants-dropdown">
                        <div className="search-box">
                          <input
                            type="text"
                            placeholder="Поиск участников..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                          />
                        </div>

                        <div className="users-list">
                          {filteredUsers.length === 0 ? (
                            <div className="no-results">
                              Участники не найдены
                            </div>
                          ) : (
                            filteredUsers.map((user) => (
                              <label key={user.id} className="user-checkbox">
                                <input
                                  type="checkbox"
                                  checked={projectData.participants.includes(
                                    user.id
                                  )}
                                  onChange={() => toggleParticipant(user.id)}
                                />
                                <span className="checkmark"></span>
                                <span className="user-info">
                                  <span className="user-name">
                                    {user.first_name} {user.last_name}
                                  </span>
                                </span>
                              </label>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="select-hint">
                    {projectData.participants.length > 0
                      ? `Выбрано участников: ${projectData.participants.length}`
                      : "Нажмите для выбора участников проекта"}
                  </div>
                </label>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn-secondary"
                >
                  Отменить
                </button>
                <button type="submit" className="btn-primary">
                  {isEditMode ? "Сохранить изменения" : "Создать проект"}
                </button>
              </div>
            </form>
          ) : (
            <div className="view-mode">
              {currentProject &&
                (() => {
                  const creator = person.find(
                    (p) => p.id === currentProject.user_id
                  );
                  const participantNames = (currentProject.participants || [])
                    .map((pid) => {
                      const participant = person.find((p) => p.id === pid);
                      return participant
                        ? `${participant.first_name} ${participant.last_name}`
                        : null;
                    })
                    .filter(Boolean);

                  return (
                    <>
                      <div className="info-grid">
                        <div className="info-section">
                          <h3 className="info-label">Название</h3>
                          <p className="info-value">{currentProject.name}</p>
                        </div>
                        {creator && (
                          <div className="info-section">
                            <h3 className="info-label">Создатель</h3>
                            <p className="info-value">
                              {creator.first_name} {creator.last_name}
                            </p>
                          </div>
                        )}
                        <div className="info-section">
                          <h3 className="info-label">Статус подтверждения</h3>
                          <p className="info-value">
                            <span
                              className={`status-badge ${
                                currentProject.is_approved
                                  ? "status-approved"
                                  : "status-pending"
                              }`}
                            >
                              {currentProject.is_approved
                                ? "✓ Подтвержден"
                                : "⏳ Ожидает подтверждения"}
                            </span>
                          </p>
                        </div>
                        <div className="info-section">
                          <h3 className="info-label">Статус проекта</h3>
                          <p className="info-value">
                            <span
                              className={`status-badge ${
                                currentProject.status === "active"
                                  ? "status-active"
                                  : "status-completed"
                              }`}
                            >
                              {currentProject.status === "active"
                                ? "Активный"
                                : "Завершённый"}
                            </span>
                          </p>
                        </div>
                        <div className="info-section">
                          <h3 className="info-label">Дата начала</h3>
                          <p className="info-value">
                            {new Date(currentProject.start_date).toLocaleString(
                              "ru-RU"
                            )}
                          </p>
                        </div>
                        <div className="info-section">
                          <h3 className="info-label">Дата окончания</h3>
                          <p className="info-value">
                            {new Date(currentProject.end_date).toLocaleString(
                              "ru-RU"
                            )}
                          </p>
                        </div>

                        {participantNames.length > 0 && (
                          <div className="info-section">
                            <h3 className="info-label">Участники</h3>
                            <div className="participants-list">
                              {participantNames.map((name, index) => (
                                <span key={index} className="participant-tag">
                                  {name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="info-section full-width">
                          <h3 className="info-label">Описание</h3>
                          <p className="info-value description-text">
                            {currentProject.description}
                          </p>
                        </div>
                        {currentProject.preview_image && (
                          <div className="info-section full-width">
                            <h3 className="info-label">Превью</h3>
                            <img
                              src={currentProject.preview_image}
                              alt="Превью проекта"
                              className="preview-image-large"
                            />
                          </div>
                        )}
                      </div>

                      <div className="view-actions">
                        <button onClick={closeModal} className="btn-secondary">
                          Закрыть
                        </button>
                        {currentProject.is_approved && (
                          <button
                            onClick={() => handleEditProject(currentProject)}
                            className="btn-primary"
                          >
                            Редактировать
                          </button>
                        )}
                      </div>
                    </>
                  );
                })()}
            </div>
          )}
        </div>
      </Modal>
    </section>
  );
};

export default ProjectAdmin;