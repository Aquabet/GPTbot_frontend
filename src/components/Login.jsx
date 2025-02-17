// Login.jsx
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { login, validateToken } from "../api/chatApi";
import ButtonWidget from "./ButtonWidget";
import "../styles/Login.css";
import { useTranslation } from "react-i18next";

const Login = ({ onLoginSuccess }) => {
  const { t, i18n } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Toggle between languages
  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "zh" : "en";
    i18n.changeLanguage(newLang);
  };

  // Validate token on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isValid = await validateToken();
        if (isValid) {
          onLoginSuccess();
        }
      } catch {
        console.log("No valid token found");
      }
    };

    checkAuth();
  }, [onLoginSuccess]);

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    if (isLoggingIn) return;
    setIsLoggingIn(true);

    try {
      await login(username, password);
      setError(null);
      onLoginSuccess();
    } catch (error) {
      // Handle errors
      if (error.response) {
        const { status } = error.response;
        if (status === 429) setError(t("error_rate_limit"));
        else if (status === 401) setError(t("error_invalid_credentials"));
        else if (status === 404) setError(t("error_user_not_found"));
        else setError(t("error_unexpected"));
      } else {
        setError(t("error_unexpected"));
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Display error messages
  const ErrorMessage = ({ message }) => {
    if (!message) return null;
    return <div className="error-message">{message}</div>;
  };

  ErrorMessage.propTypes = {
    message: PropTypes.string,
  };

  return (
    <div className="login-container">
      <h2 className="login-title">{t("title")}</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <input
          type="text"
          placeholder={t("username")}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="login-input"
        />
        <input
          type="password"
          placeholder={t("password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="login-input"
        />
        <ButtonWidget type="submit" className="login-button">
          {t("login")}
        </ButtonWidget>
        <ButtonWidget onClick={toggleLanguage}>
          {i18n.language === "en" ? "简体中文" : "English"}
        </ButtonWidget>
        <ErrorMessage message={error} />
      </form>
    </div>
  );
};

Login.propTypes = {
  onLoginSuccess: PropTypes.func.isRequired,
};

export default Login;
