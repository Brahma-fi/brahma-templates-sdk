import { IconProps } from "./types";

export default function CopyIcon({
  height = 14,
  width = 14,
  color = "inherit",
  cursor = "pointer",
  onClick,
}: IconProps) {
  return (
    <svg
      onClick={onClick}
      width={width}
      height={height}
      viewBox="0 0 14 14"
      cursor={cursor}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_27778_122481)">
        <path
          d="M9.33464 0.583496H2.33464C1.69297 0.583496 1.16797 1.1085 1.16797 1.75016V9.91683H2.33464V1.75016H9.33464V0.583496ZM11.0846 2.91683H4.66797C4.0263 2.91683 3.5013 3.44183 3.5013 4.0835V12.2502C3.5013 12.8918 4.0263 13.4168 4.66797 13.4168H11.0846C11.7263 13.4168 12.2513 12.8918 12.2513 12.2502V4.0835C12.2513 3.44183 11.7263 2.91683 11.0846 2.91683ZM11.0846 12.2502H4.66797V4.0835H11.0846V12.2502Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_27778_122481">
          <rect width={14} height={14} fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
