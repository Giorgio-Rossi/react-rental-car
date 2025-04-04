import React from 'react';

interface ButtonConfig {
    label: string;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    style?: {
        color?: string;
        backgroundColor?: string;
        border?: string;
    };
    action?: () => void;
}

interface ButtonProps {
    label: string;
    config?: ButtonConfig;
    icon?: string;
    customCssClass?: string;
    onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
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