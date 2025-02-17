// chatApp.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import {
  fetchChatResponse,
  fetchChatHistory,
  createSession,
  deleteSession,
  getSessions,
  renameSession,
} from "../api/chatApi";
import { useTranslation } from "react-i18next";
import Sidebar from "./Sidebar";
import MessageList from "./MessageList";
import InputBox from "./InputBox";
import PropTypes from "prop-types";
import ButtonWidget from "./ButtonWidget";
import modelConfig from "../config/modelConfig";
import "../styles/ChatApp.css";
import { t } from "i18next";

const ChatApp = ({ onLogout }) => {
  const [messages, setMessages] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedModelFull, setSelectedModelFull] =
    useState("openai:gpt-4-turbo");
  const chatBoxRef = useRef(null);
  const { i18n } = useTranslation();

  // Encapsulate scroll-to-bottom logic
  const scrollToBottom = useCallback(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTo({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  // Load session messages and scroll to bottom
  const loadSessionMessages = useCallback(
    async (sessionId) => {
      try {
        const history = await fetchChatHistory(sessionId);
        setMessages(history);
        scrollToBottom();
      } catch (error) {
        console.error("Failed to load session messages:", error.message);
      }
    },
    [scrollToBottom]
  );

  // Load session list and messages for the first session when component mounts
  useEffect(() => {
    const loadSessions = async () => {
      try {
        const sessionList = await getSessions();
        setSessions(sessionList);
        if (sessionList.length > 0) {
          const firstSessionId = sessionList[0].sessionId;
          setCurrentSessionId(firstSessionId);
          await loadSessionMessages(firstSessionId);
        }
      } catch (error) {
        console.error("Failed to load sessions:", error.message);
      }
    };
    loadSessions();
  }, [loadSessionMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Toggle language between English and Chinese
  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "zh" : "en";
    i18n.changeLanguage(newLang);
  };

  // Rename a session
  const handleRenameSession = async (sessionId, newName) => {
    if (!newName.trim()) {
      alert("New session name cannot be empty");
      return;
    }
    try {
      await renameSession(sessionId, newName);
      setSessions((prevSessions) =>
        prevSessions.map((s) =>
          s.sessionId === sessionId ? { ...s, sessionName: newName } : s
        )
      );
    } catch (error) {
      console.error("Failed to rename session:", error.message);
    }
  };

  // Send a message and get the response from the assistant
  const handleSendMessage = async (input) => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setLoading(true);

    try {
      let sessionId = currentSessionId;
      // If there is no current session, create a new one
      if (!sessionId) {
        const newSession = await createSession();
        sessionId = newSession.sessionId;
        setCurrentSessionId(sessionId);
        setSessions((prevSessions) => [
          ...prevSessions,
          { sessionId, sessionName: newSession.sessionName },
        ]);
      }

      const [modelProvider, modelName] = selectedModelFull.split(":");

      // Pass the selectedModel as an additional parameter
      const assistantMessage = await fetchChatResponse(
        userMessage,
        sessionId,
        onLogout,
        modelProvider,
        modelName
      );

      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error("Failed to fetch chat response:", error.message);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  // Create a new session
  const handleCreateSession = async () => {
    try {
      const newSession = await createSession();
      setSessions((prevSessions) => [...prevSessions, newSession]);
      setCurrentSessionId(newSession.sessionId);
      setMessages([]);
    } catch (error) {
      console.error("Failed to create new session:", error.message);
    }
  };

  // Delete a session
  const handleDeleteSession = async (sessionId) => {
    try {
      await deleteSession(sessionId);
      const updatedSessions = sessions.filter((s) => s.sessionId !== sessionId);
      setSessions(updatedSessions);
      const nextSessionId = updatedSessions[0]?.sessionId || null;
      setCurrentSessionId(nextSessionId);
      if (nextSessionId) {
        await loadSessionMessages(nextSessionId);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error("Failed to delete session:", error.message);
    }
  };

  return (
    <div className="chat-app">
      <Sidebar
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={(sessionId) => {
          setCurrentSessionId(sessionId);
          loadSessionMessages(sessionId);
        }}
        onCreateSession={handleCreateSession}
        onDeleteSession={handleDeleteSession}
        onRenameSession={handleRenameSession}
      />
      <div className="chat-window">
        <div className="chat-header">
          <ButtonWidget onClick={toggleLanguage}>
            {i18n.language === "en" ? "简体中文" : "English"}
          </ButtonWidget>
          <ButtonWidget onClick={onLogout} className="logout-button">
            {t("logout")}
          </ButtonWidget>
          <select
            className="model-selector"
            value={selectedModelFull}
            onChange={(e) => setSelectedModelFull(e.target.value)}
            title="Select Model"
          >
            {Object.keys(modelConfig).map((providerKey) => (
              <optgroup
                label={modelConfig[providerKey].displayName}
                key={providerKey}
              >
                {modelConfig[providerKey].models.map((model) => (
                  <option
                    key={model.modelName}
                    value={`${providerKey}:${model.modelName}`}
                  >
                    {model.displayName}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <div className="chat-box" ref={chatBoxRef}>
          <MessageList messages={messages} loading={loading} />
        </div>
        <div className="input-container">
          <InputBox onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
};

ChatApp.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default ChatApp;
