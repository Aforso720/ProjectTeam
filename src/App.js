import React, { useState, useEffect, useCallback } from "react";
import "./App.scss";
import Header from "./Component/Header";
import Footer from "./Component/Footer";
import Home from "./Pages/Home/Home.jsx";
import { Route, Routes, useLocation, Navigate, useNavigate } from "react-router";
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
import {useAuth} from "./API/auth.js";
import usePeople from "./API/usePeople.js";
import EventDetail from "./Component/EventDetail/EventDetail.jsx";
import useEvent from "./API/useEvent.js";

export const MyContext = React.createContext();

function App() {
  const {
    token: authToken,
    user,
    login,
    logout,
    loading: loadingAuth,
    error: authError,
    isAuthenticated,
  } = useAuth();
  const { person: topPerson, isLoadingTop } = usePeople({ authToken });
  const { news, loading: loadingMyNews } = usePosts();
  const { person: homePerson, isloading: isloadingPersHome } = usePerson({ amount: 3 , authToken });
  const { manager, isloading: isloadingMng } = useManager({ authToken });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminPage = location.pathname.includes("/admin");
  const { events } = useEvent({ authToken });
  
  useEffect(() => {
    const isProtectedRoute =
      location.pathname === "/profile" ||
      location.pathname.startsWith("/admin");

    if (isProtectedRoute && !authToken) {
      setShowAuthModal(true);
      if (location.pathname.startsWith("/admin")) {
        navigate("/");
      }
    }
  }, [location.pathname, authToken, navigate]);

  const handleCloseModal = useCallback(() => {
    setShowAuthModal(false);
    if (location.pathname === "/profile") {
      navigate("/");
    }
  }, [location.pathname, navigate]);

  const ProtectedRoute = useCallback(({ children, adminOnly = false }) => {
    if (!authToken) {
      return <Navigate to="/" replace />;
    }
    if (adminOnly && !user?.is_admin) {
      return <Navigate to="/" replace />;
    }
    return children;
  }, [authToken, user?.id]);

  return (
    <MyContext.Provider
      value={{
        news,
        user,
        topPerson,
        manager,
        homePerson,
        loadingMyNews,
        isloadingPersHome,
        isLoadingTop,
        isloadingMng,
        userActive: isAuthenticated,
        authToken,
      }}
    >
      <div className="App">
        {isAdminPage ? (
          <HeaderAdmin handleLogout={logout} />
        ) : (
          <Header
            userActive={isAuthenticated} 
            user={user}
            handleLogout={logout}
          />
        )}

        <main className="Content">
          <Routes>
            <Route
              path="/admin/journal"
              element={
                <ProtectedRoute adminOnly>
                  <Journals />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/managing"
              element={
                <ProtectedRoute adminOnly>
                  <PersonSetting />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/contest"
              element={
                <ProtectedRoute adminOnly>
                  <EventAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/journals/:id"
              element={
                <ProtectedRoute adminOnly>
                  <Table />
                </ProtectedRoute>
              }
            />

            <Route path="/" element={<Home />} />
            <Route path="/contests" element={<Contests />} />
            <Route path="/about-us" element={<About />} />
            <Route path="/members" element={<Members />} />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Account handleLogoutAuth={logout} />
                </ProtectedRoute>
              }
            />

            <Route path="/events/:id" element={<EventDetail events={news} />} />
            <Route path="/events/:id" element={<EventDetail events={events} />} />

            <Route path="*" element={<div>Страница не найдена</div>} />
          </Routes>
        </main>

        <Footer />

        {showAuthModal && (
          <AuthModal
            onClose={handleCloseModal}
            handleLogin={login}
            loading={loadingAuth}
            error={authError}
          />
        )}
      </div>
    </MyContext.Provider>
  );
}

export default App;
