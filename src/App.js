import React, { useState } from "react";
import "./App.scss";
import Header from "./Component/Header";
import Footer from "./Component/Footer";
import Home from "./Pages/Home/Home.jsx";
import { Route, Routes, useLocation } from "react-router-dom";
import Contests from "./Pages/Contests/Contests.jsx";
import Account from "./Pages/Account";
import About from "./Pages/about/AboutUs";
import Members from "./Pages/Members";
import usePosts from "./API/usePosts";
import usePerson from "./API/usePerson";
import useManager from "./API/useManager";
import HeaderAdmin from "./Component/admin/HeaderAdmin";
import Table from "./Pages/tables/Table";
import Journals from "./Pages/journals/Journals";
import PersonSetting from "./Pages/personSetting/PersonSetting.jsx";
import EventAdmin from "./Pages/eventsAdmin/EventAdmin.jsx";
import AuthModal from "./Pages/AuthModal/AuthModal.jsx";

export const MyContext = React.createContext([]);

function App() {
  const { events, loading: loadingMyEvent } = usePosts();
  const { person: topPerson, isloading: isloadingTop } = usePerson();
  const { person: homePerson, isloading: isloadingPersHome } = usePerson({
    amount: 3,
  });
  const { manager, isloading: isloadingMng } = useManager();
  const [userId, setUserId] = useState(1);
  const [userActive, setUserActive] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const location = useLocation();
  const isAdminPage = location.pathname.includes("/admin");

  React.useEffect(() => {
  if (location.pathname === "/profile" && !userId) {
    setShowAuthModal(true);
  } else {
    setShowAuthModal(false);
  }
}, [location.pathname, userId]);

  return (
    <MyContext.Provider
      value={{
        events,
        userId,
        topPerson,
        manager,
        homePerson,
        loadingMyEvent,
        isloadingPersHome,
        isloadingTop,
        isloadingMng,
        userActive,
        setUserId,
        setUserActive,
      }}
    >
      <div className="App">
        {isAdminPage ? (
          <HeaderAdmin />
        ) : (
          <Header setUserActive={setUserActive} />
        )}

        <div className="Content">
          <Routes>
            <Route path="/admin/journal" element={<Journals />} />
            <Route path="/admin/managing" element={<PersonSetting />} />
            <Route path="/admin/contest" element={<EventAdmin />} />
            <Route path="/admin/journals/:id" element={<Table />} />

            <Route path="/" element={<Home />} />
            <Route path="/contests" element={<Contests />} />
            <Route path="/about-us" element={<About />} />
            <Route path="/members" element={<Members />} />
            <Route
              path="/profile"
              element={
                userId ? (
                  <Account setUserActive={setUserActive} setUserId={setUserId} />
                ) : (
                  <Home />
                )
              }
            />
            <Route path="*" element={<div>Страница не найдена</div>} />
          </Routes>
        </div>

        <Footer />

        {/* Модальное окно авторизации */}
        {showAuthModal && (
          <AuthModal
            onClose={() => setShowAuthModal(false)}
          />
        )}
      </div>
    </MyContext.Provider>
  );
}

export default App;