import { useState, useEffect, useRef } from "react";
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
import "../styles/ChatApp.css";

const ChatApp = ({ onLogout }) => {
  const [messages, setMessages] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const chatBoxRef = useRef(null);
  const { i18n } = useTranslation();

  // Load sessions and their messages on mount
  useEffect(() => {
    const loadSessions = async () => {
      const sessionList = await getSessions();
      setSessions(sessionList);
      if (sessionList.length > 0) {
        setCurrentSessionId(sessionList[0].sessionId);
        loadSessionMessages(sessionList[0].sessionId);
      }
    };
    loadSessions();
  }, []);

  // Scroll to the latest message when messages update
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTo(0, chatBoxRef.current.scrollHeight);
    }
  }, [messages]);

  // Toggle language
  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "zh" : "en";
    i18n.changeLanguage(newLang);
  };

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

  const loadSessionMessages = async (sessionId) => {
    const history = await fetchChatHistory(sessionId);
    setMessages(history);
    chatBoxRef.current?.scrollTo(0, chatBoxRef.current.scrollHeight);
  };

  const handleSendMessage = async (input) => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setLoading(true);

    try {
      let sessionId = currentSessionId;

      if (!sessionId) {
        const newSession = await createSession();
        sessionId = newSession.sessionId;
        setCurrentSessionId(sessionId);
        setSessions((prevSessions) => [
          ...prevSessions,
          { sessionId, sessionName: newSession.sessionName },
        ]);
      }

      const assistantMessage = await fetchChatResponse(
        userMessage,
        sessionId,
        onLogout
      );

      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error("Failed to fetch chat response:", error.message);
    } finally {
      setLoading(false);
      chatBoxRef.current?.scrollTo(0, chatBoxRef.current.scrollHeight);
    }
  };

  const handleCreateSession = async () => {
    const newSession = await createSession();
    setSessions((prevSessions) => [...prevSessions, newSession]);
    setCurrentSessionId(newSession.sessionId);
    setMessages([]);
  };

  const handleDeleteSession = async (sessionId) => {
    await deleteSession(sessionId);
    const updatedSessions = sessions.filter((s) => s.sessionId !== sessionId);
    setSessions(updatedSessions);
    const nextSessionId = updatedSessions[0]?.sessionId || null;
    setCurrentSessionId(nextSessionId);
    setMessages([]);
    if (nextSessionId) loadSessionMessages(nextSessionId);
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
            Logout
          </ButtonWidget>
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
