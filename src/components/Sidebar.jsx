import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../styles/Sidebar.css";

const Sidebar = ({
  sessions,
  currentSessionId,
  onSelectSession,
  onCreateSession,
  onDeleteSession,
  onRenameSession,
}) => {
  const [renamingSessionId, setRenamingSessionId] = useState(null);
  const [newSessionName, setNewSessionName] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isSidebarOpen &&
        !event.target.closest(".sidebar") &&
        !event.target.closest(".sidebar-toggle-btn")
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isSidebarOpen]);

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

  return (
    <>
      {!isSidebarOpen && (
        <button
          className="sidebar-toggle-btn"
          onClick={() => setIsSidebarOpen(true)}
          title="Toggle Sidebar"
        >
          ☰
        </button>
      )}
      <div className={`sidebar ${isSidebarOpen ? "active" : ""}`}>
        <div className="sidebar-header">
          <button className="new-session-btn" onClick={onCreateSession}>
            + New Chat
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
                setIsSidebarOpen(false);
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
