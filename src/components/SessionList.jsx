import PropTypes from "prop-types";
import "../styles/SessionList.css";
import { useTranslation } from "react-i18next";

const SessionList = ({
  sessions,
  currentSessionId,
  onSessionSelect,
  onCreateSession,
  onDeleteSession,
}) => {
  const { t } = useTranslation();

  return (
    <div className="session-list">
      <h3>{t("sessions")}</h3>
      <div className="session-controls">
        <select
          value={currentSessionId || ""}
          onChange={(e) => onSessionSelect(e.target.value)}
          className="session-select"
        >
          {sessions.map((session) => (
            <option key={session.sessionId} value={session.sessionId}>
              {session.sessionName || t("new_session")}
            </option>
          ))}
        </select>
        <button
          onClick={onCreateSession}
          className="create-session-button"
          title={t("create_session")}
        >
          {t("new_session")}
        </button>
        {currentSessionId && (
          <button
            onClick={() => onDeleteSession(currentSessionId)}
            className="delete-session-button"
            title={t("delete_session")}
          >
            {t("delete_session")}
          </button>
        )}
      </div>
    </div>
  );
};

SessionList.propTypes = {
  sessions: PropTypes.arrayOf(
    PropTypes.shape({
      sessionId: PropTypes.string.isRequired,
      sessionName: PropTypes.string,
    })
  ).isRequired,
  currentSessionId: PropTypes.string,
  onSessionSelect: PropTypes.func.isRequired,
  onCreateSession: PropTypes.func.isRequired,
  onDeleteSession: PropTypes.func.isRequired,
};

export default SessionList;
