import React from "react";

export type ValidIconName = "empty" | "globe" | "cv" | "home" | "template";

export function Icon(props: { name: ValidIconName; className: string }) {
  switch (props.name) {
    case "empty":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          className={props.className}
        />
      );
    case "globe":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          className={props.className}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
          ></path>
        </svg>
      );
    case "cv":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
          <path d="M14 3v5h5M16 13H8M16 17H8M10 9H8"/>
          </svg>
      );
      case "home":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"  stroke="#000000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
        );
        case "template":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <path d="M3 9h18M9 21V9"/>
          </svg>
        );
    default:
      return null;
  }
}

export const IconWithTooltip = ({ name, className, tooltip, tooltipClassName }: {
  name: ValidIconName;
  className: string;
  tooltip?: string;
  tooltipClassName?: string;
}) => {
  const icon = <Icon name={name} className={className} />;
  if (!tooltip) return icon;
  return (
    <span className={tooltipClassName} title={tooltip} style={{ cursor: "help" }}>
      {icon}
    </span>
  );
};

export default Icon; 