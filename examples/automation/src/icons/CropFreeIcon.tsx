import { IconProps } from "./types";

export default function CropFreeIcon({
  height = 16,
  width = 16,
  color = "#6D7178",
}: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_42083_2049)">
        <path
          d="M2 3.33333V6H3.33333V3.33333H6V2H3.33333C2.6 2 2 2.6 2 3.33333ZM3.33333 10H2V12.6667C2 13.4 2.6 14 3.33333 14H6V12.6667H3.33333V10ZM12.6667 12.6667H10V14H12.6667C13.4 14 14 13.4 14 12.6667V10H12.6667V12.6667ZM12.6667 2H10V3.33333H12.6667V6H14V3.33333C14 2.6 13.4 2 12.6667 2Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_42083_2049">
          <rect width="16" height="16" fill={color} />
        </clipPath>
      </defs>
    </svg>
  );
}
