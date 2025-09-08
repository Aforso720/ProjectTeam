import React from "react";
import useManager from "../../../API/useManager";
import Loader from "../../../Component/Loader";

const ManagerList = () => {
  const {isloading:isloadingMng , manager } = useManager()

  return (
    <ul className="manager__list">
      {isloadingMng
        ? Array.from({ length: 3 }).map((_, index) => (
            <li key={index}>
              <Loader />
            </li>
          ))
        : manager.map((item, index) => (
            <li key={index}>
              <div className="card_manager">
                <img src="img/kot.webp" alt="" />
                <h4>{item.first_name}</h4>
                {item.status === "главный админ" ? (
                  <p>Руководитель проектной команды</p>
                ) : (
                  <p>Секретарь</p>
                )}
              </div>
            </li>
          ))}
    </ul>
  );
};

export default ManagerList;
