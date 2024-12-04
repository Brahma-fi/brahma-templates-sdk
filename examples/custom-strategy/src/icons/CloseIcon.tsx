import { IconProps } from "./types";

export default function CloseIcon({
  height = 16,
  width = 16,
  color = "inherit",
  onClick,
  cursor = "pointer",
}: IconProps) {
  return (
    <svg
      cursor={cursor}
      width={height}
      height={width}
      onClick={onClick}
      style={{ cursor: "pointer" }}
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.272 3.33346L3.33203 4.27343L7.05858 7.99998L3.33203 11.7265L4.272 12.6665L7.99856 8.93995L11.7251 12.6665L12.6651 11.7265L8.93853 7.99998L12.6651 4.27343L11.7251 3.33346L7.99855 7.06001L4.272 3.33346Z"
        fill={color}
      />
    </svg>
  );
}
