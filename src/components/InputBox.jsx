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

  return (
    <div className="inputbox">
      <input
        type="text"
        placeholder={t("message_placeholder")} // Placeholder text for localization
        value={input}
        onChange={(e) => setInput(e.target.value)} // Update input value on change
        onKeyDown={(e) => e.key === "Enter" && handleSend()} // Send message on Enter key
      />
      <ButtonWidget onClick={handleSend}>{t("send")}</ButtonWidget>
    </div>
  );
};

InputBox.propTypes = {
  onSendMessage: PropTypes.func.isRequired, // Callback for sending messages
};

export default InputBox;
