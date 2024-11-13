import { useState } from "react";
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
    <div className="sidebar">
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
            onClick={() => onSelectSession(session.sessionId)}
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
