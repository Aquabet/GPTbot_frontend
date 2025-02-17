import PropTypes from "prop-types";
import Message from "./Message";
import "../styles/MessageList.css";
import { useTranslation } from "react-i18next";

const MessageList = ({ messages, loading }) => {
  const { t } = useTranslation();

  return (
    <div className="message-list">
      {messages.map((message, index) => (
        <Message key={index} message={message} />
      ))}
      {loading && <div className="loading">{t("assistant_typing")}</div>}
    </div>
  );
};

MessageList.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      role: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
    })
  ).isRequired,
  loading: PropTypes.bool,
};

export default MessageList;
