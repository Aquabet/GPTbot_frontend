import PropTypes from "prop-types";
import Message from "./Message";
import "../styles/MessageList.css";

const MessageList = ({ messages, loading }) => (
  <div className="message-list">
    {messages.map((message, index) => (
      <Message key={index} message={message} />
    ))}
    {loading && <div className="loading">Assistant is typing...</div>}
  </div>
);

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
