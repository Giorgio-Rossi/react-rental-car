import React from 'react';
import './button.css';

const Button = ({
  config,
  icon,
  customCssClass,
  onClick
}) => {
  const handleClick = () => {
    if (config?.action) {
      config.action();
    }
    if (onClick) {
      onClick();
    }
  };

  const buttonStyle = config?.style || {};

  return (
    <button
      type={config?.type || 'button'}
      disabled={config?.disabled}
      className={customCssClass}
      style={buttonStyle}
      onClick={handleClick}
    >
      {icon && <i className={icon}></i>}
      {config?.label}
    </button>
  );
};

export default Button;
