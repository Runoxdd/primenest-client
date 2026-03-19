import "./layout.scss";
import Navbar from "../../components/navbar/Navbar";
import AIWidget from "../../components/ai-widget/AIWidget";
import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function Layout() {
  return (
    <div className="layout">
      <div className="layout-navbar">
        <Navbar />
      </div>
      <main className="layout-content">
        <Outlet />
      </main>
      <AIWidget />
    </div>
  );
}

function RequireAuth() {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="layout">
      <div className="layout-navbar">
        <Navbar />
      </div>
      <main className="layout-content">
        <Outlet />
      </main>
      <AIWidget />
    </div>
  );
}

function RequireAdmin() {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser || !currentUser.isAdmin) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="layout">
      <div className="layout-navbar">
        <Navbar />
      </div>
      <main className="layout-content">
        <Outlet />
      </main>
      <AIWidget />
    </div>
  );
}

export { Layout, RequireAuth, RequireAdmin };
