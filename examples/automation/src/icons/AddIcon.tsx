import { IconProps } from "./types";

export default function AddIcon({
  height = 16,
  width = 16,
  color = "#B2F8FF",
  cursor,
  onClick,
}: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      cursor={cursor}
      onClick={onClick}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_21722_161063)">
        <path
          d="M12.6693 8.66659H8.66927V12.6666H7.33594V8.66659H3.33594V7.33325H7.33594V3.33325H8.66927V7.33325H12.6693V8.66659Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_21722_161063">
          <rect width={16} height={16} fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
