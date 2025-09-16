import React, { useState, useEffect, useCallback, Suspense } from "react";
import "./App.scss";
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router";
import Header from "./Component/Header";
import Footer from "./Component/Footer";
import HeaderAdmin from "./Component/admin/HeaderAdmin";

import Home from "./Pages/Home/Home.jsx";
import Contests from "./Pages/Contests/Contests.jsx";
import Account from "./Pages/Account/Account.jsx";
import About from "./Pages/about/AboutUs";
import Members from "./Pages/Members/Members.jsx";
import AuthModal from "./Pages/AuthModal/AuthModal.jsx";
import LoginPage from "./Pages/Login/LoginPage.jsx";

import Journals from "./Pages/journals/Journals.jsx";
import PersonSetting from "./Pages/personSetting/PersonSetting.jsx";
import Table from "./Pages/tables/Table.jsx";

// API hooks
import { useAuth } from "./API/auth";

// Contexts
import { AuthContext } from "./context/AuthContext";
import EventDetail from "./Component/EventDetail/EventDetail.jsx";
import AdminFilterEvent from "./Component/adminHeaderEvent/adminHeaderEvent.jsx";

import { NotificationProvider } from "./context/NotificationContext.js";
import Notisfaction from "./Elements/Notisfaction/index.jsx";
import { JoinProjectPage } from "./components/ProjectInvites";

function App() {
  // AUTH
  const {
    token: authToken,
    user,
    login,
    logout,
    loading: loadingAuth,
    error: authError,
    isAuthenticated,
  } = useAuth();

  // UI State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingJoinIntent, setPendingJoinIntentState] = useState(() => {
    try {
      const stored = localStorage.getItem("pendingJoinIntent");
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error("Не удалось прочитать pendingJoinIntent", error);
      return null;
    }
  });
  const location = useLocation();
  const navigate = useNavigate();

  const setPendingJoinIntent = useCallback((intent) => {
    setPendingJoinIntentState(intent);
    if (intent) {
      localStorage.setItem("pendingJoinIntent", JSON.stringify(intent));
    } else {
      localStorage.removeItem("pendingJoinIntent");
    }
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    setPendingJoinIntent(null);
  }, [logout, setPendingJoinIntent]);

  const isAdminPage = location.pathname.includes("/admin");

  useEffect(() => {
    if (!authToken || !pendingJoinIntent?.redirectTo) return;
    const target = pendingJoinIntent.redirectTo;
    const currentPath = `${location.pathname}${location.search || ""}`;

    if (currentPath === target) return;
    navigate(target, { replace: true });
  }, [
    authToken,
    location.pathname,
    location.search,
    navigate,
    pendingJoinIntent?.redirectTo,
  ]);

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

  const ProtectedRoute = useCallback(
    ({ children, adminOnly = false }) => {
      if (!authToken) return <Navigate to="/" replace />;
      if (adminOnly && !user?.is_admin) return <Navigate to="/" replace />;
      return children;
    },
    [authToken, user?.is_admin]
  );

  return (
    <AuthContext.Provider
      value={{
        authToken,
        user,
        login,
        logout: handleLogout,
        isAuthenticated,
        pendingJoinIntent,
        setPendingJoinIntent,
      }}
    >
      <NotificationProvider>
        <div className="App">
          {isAdminPage ? (
            <HeaderAdmin handleLogout={handleLogout} />
          ) : (
            <Header
              userActive={isAuthenticated}
              user={user}
              handleLogout={handleLogout}
            />
          )}

          <main className="Content">
            {/* <Suspense fallback={<Loader/>}> */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/contests" element={<Contests />} />
              <Route path="/about-us" element={<About />} />
              <Route path="/members" element={<Members />} />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Account handleLogoutAuth={handleLogout} />
                  </ProtectedRoute>
                }
              />

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
                    <section className="eventAdminPage">
                      <AdminFilterEvent />
                    </section>
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

              <Route path="/events/:id" element={<EventDetail />} />
              {/* <Route path="/events/:id" element={<EventDetail events={events} />} /> */}
              <Route path="/join/:projectId" element={<JoinProjectPage />} />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
            {/* </Suspense> */}
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
      </NotificationProvider>
    </AuthContext.Provider>
  );
}

export default App;
