import { useState, useEffect, useCallback } from "react";
import ChatApp from "./components/ChatApp";
import Login from "./components/Login";
import { logout } from "./api/chatApi";
import axios from "axios";
import "./styles/App.css";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
  };

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      setIsAuthenticated(false);
      localStorage.removeItem("isAuthenticated");
    } catch (error) {
      console.error("Failed to logout", error.message);
    }
  }, []);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        await axios.get("/api/gpt", { withCredentials: true });
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setIsAuthenticated(false);
          localStorage.removeItem("isAuthenticated");
        }
      }
    };

    if (isAuthenticated) {
      checkAuthStatus();
    }
  }, [isAuthenticated]);

  return (
    <div>
      {isAuthenticated ? (
        <ChatApp onLogout={handleLogout} />
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
};

export default App;
