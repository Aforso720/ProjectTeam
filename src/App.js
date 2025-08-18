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
import Account from "./Pages/Account";
import About from "./Pages/about/AboutUs";
import Members from "./Pages/Members";
import AuthModal from "./Pages/AuthModal/AuthModal.jsx";


import EventAdmin from './Pages/eventsAdmin/EventAdmin.jsx'
import Journals from './Pages/journals/Journals.jsx'
import PersonSetting from './Pages/personSetting/PersonSetting.jsx'
import Table from './Pages/tables/Table.jsx'

// API hooks
import { useAuth } from "./API/auth";

// Contexts
import { AuthContext } from "./context/AuthContext";
import Loader from "./Component/Loader.jsx";
import EventDetail from './Component/EventDetail/EventDetail.jsx'

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
  const location = useLocation();
  const navigate = useNavigate();

  const isAdminPage = location.pathname.includes("/admin");

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
      value={{ authToken, user, login, logout, isAuthenticated }}
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
                      <Account handleLogoutAuth={logout} />
                    </ProtectedRoute>
                  }
                />

                {/* Lazy admin routes */}
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


                <Route path="/events/:id" element={<EventDetail />} />
                {/* <Route path="/events/:id" element={<EventDetail events={events} />} /> */}
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
    </AuthContext.Provider>
  );
}

export default App;
