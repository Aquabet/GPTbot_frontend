import React from "react";
import "../styles/ButtonWidget.css";
import PropTypes from "prop-types";

// A reusable button component with hover and disabled styles
const ButtonWidget = ({
  onClick,
  children,
  style = {},
  hoverStyle = {},
  disabled = false,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <button
      onClick={onClick}
      className="button-widget"
      style={{
        ...style,
        ...(isHovered ? hoverStyle : {}),
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
      }}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </button>
  );
};

ButtonWidget.propTypes = {
  onClick: PropTypes.func, // Function to handle button click
  children: PropTypes.node, // Button content (text or elements)
  style: PropTypes.object, // Inline styles for the button
  hoverStyle: PropTypes.object, // Styles applied on hover
  disabled: PropTypes.bool, // Disables the button if true
};

export default ButtonWidget;
