import React, { useState, useEffect } from "react";
import './adminHeaderEvent.scss'
import NewsAdmin from '../../Pages/newsAdmin/NewsAdmin';
import EventAdmin from '../../Pages/eventsAdmin/EventAdmin'
import ProjectAdmin from "../../Pages/ProjectAdmin/ProjectAdmin";

const AdminHeaderEvent = () => {
  const [activeFilter, setActiveFilter] = useState(() => {
    const savedFilter = localStorage.getItem('adminActiveTab');
    return savedFilter || "event";
  });

  const filters = [
    { id: "event", name: "Конкурсы" },
    { id: "news", name: "Новости" },
    { id: "project", name: "Проекты" },
  ];

  useEffect(() => {
    localStorage.setItem('adminActiveTab', activeFilter);
  }, [activeFilter]);

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
  };

  return (
    <div className="activeEventAdmin">
      <div className="event-filters">
        {filters.map((filter) => (
          <button
            key={filter.id}
            className={`filter-btn ${activeFilter === filter.id ? "active" : ""}`}
            onClick={() => handleFilterChange(filter.id)}
          >
            {filter.name}
          </button>
        ))}
      </div>
      {activeFilter === 'event' &&  <EventAdmin/>}
      {activeFilter === 'news' &&  <NewsAdmin/> }
      {activeFilter === 'project' &&  <ProjectAdmin/> }
    </div>
  );
};

export default AdminHeaderEvent;