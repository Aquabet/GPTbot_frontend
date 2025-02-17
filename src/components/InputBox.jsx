import { useState } from "react";
import PropTypes from "prop-types";
import ButtonWidget from "./ButtonWidget";
import "../styles/InputBox.css";
import { useTranslation } from "react-i18next";

const InputBox = ({ onSendMessage }) => {
  const [input, setInput] = useState("");
  const { t } = useTranslation();

  // Handle sending the message
  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput(""); // Clear input after sending
    }
  };

  // Handle key press: Enter sends message, Shift + Enter creates a new line
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        // Shift + Enter -> Insert newline
        e.preventDefault();
        setInput((prev) => prev + "\n");
      } else {
        // Enter (without Shift) -> Send message
        e.preventDefault();
        handleSend();
      }
    }
  };

  return (
    <div className="inputbox">
      <textarea
        className="message-input"
        placeholder={t("message_placeholder")} // Placeholder text for localization
        value={input}
        onChange={(e) => setInput(e.target.value)} // Update input value on change
        onKeyDown={handleKeyDown} // Handle Enter and Shift+Enter
        rows={2} // Default height
      />
      <ButtonWidget onClick={handleSend}>{t("send")}</ButtonWidget>
    </div>
  );
};

InputBox.propTypes = {
  onSendMessage: PropTypes.func.isRequired, // Callback for sending messages
};

export default InputBox;
