import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { MenuOutlined } from "@ant-design/icons";
import "../styles/Sidebar.css";
import { useTranslation } from "react-i18next";


const Sidebar = ({
  sessions,
  currentSessionId,
  onSelectSession,
  onCreateSession,
  onDeleteSession,
  onRenameSession,
}) => {
  const { t } = useTranslation();
  const [renamingSessionId, setRenamingSessionId] = useState(null);
  const [newSessionName, setNewSessionName] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsSidebarOpen(true);
        setIsMobile(false);
      } else {
        setIsSidebarOpen(false);
        setIsMobile(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && isSidebarOpen && !event.target.closest(".sidebar")) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, isSidebarOpen]);

  const handleRenameSubmit = async (e) => {
    e.preventDefault();
    if (!newSessionName.trim()) {
      alert("Session name cannot be empty");
      return;
    }
    await onRenameSession(renamingSessionId, newSessionName);
    resetRenameState();
  };

  const resetRenameState = () => {
    setRenamingSessionId(null);
    setNewSessionName("");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <>
      {isMobile && !isSidebarOpen && (
        <button
          className="sidebar-toggle-btn"
          onClick={toggleSidebar}
          title="Open Sidebar"
        >
          <MenuOutlined />
        </button>
      )}

      {isMobile && isSidebarOpen && (
        <div className="overlay" onClick={toggleSidebar}></div>
      )}

      <div className={`sidebar ${isSidebarOpen ? "active" : ""}`}>
        <div className="sidebar-header">
          <button className="new-session-btn" onClick={onCreateSession}>
            + {t("new_session")}
          </button>
        </div>
        <div className="session-list">
          {sessions.map((session) => (
            <div
              key={session.sessionId}
              className={`session-item ${
                session.sessionId === currentSessionId ? "active" : ""
              }`}
              onClick={() => {
                onSelectSession(session.sessionId);
                if (isMobile) setIsSidebarOpen(false);
              }}
            >
              {session.sessionId === renamingSessionId ? (
                <form onSubmit={handleRenameSubmit}>
                  <input
                    type="text"
                    value={newSessionName}
                    onChange={(e) => setNewSessionName(e.target.value)}
                    autoFocus
                    onBlur={resetRenameState}
                    onClick={(e) => e.stopPropagation()}
                  />
                </form>
              ) : (
                <>
                  {session.sessionName || "New Session"}
                  <div className="session-actions">
                    <button
                      className="rename-btn"
                      title="Rename Session"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRenamingSessionId(session.sessionId);
                        setNewSessionName(session.sessionName || "");
                      }}
                    >
                      ✏️
                    </button>
                    <button
                      className="delete-btn"
                      title="Delete Session"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(session.sessionId);
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

Sidebar.propTypes = {
  sessions: PropTypes.arrayOf(
    PropTypes.shape({
      sessionId: PropTypes.string.isRequired,
      sessionName: PropTypes.string,
    })
  ).isRequired,
  currentSessionId: PropTypes.string,
  onSelectSession: PropTypes.func.isRequired,
  onCreateSession: PropTypes.func.isRequired,
  onDeleteSession: PropTypes.func.isRequired,
  onRenameSession: PropTypes.func.isRequired,
};

export default Sidebar;
