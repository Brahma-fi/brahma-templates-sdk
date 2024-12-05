import { IconProps } from "./types";

export default function RefreshIcon({
  width = 20,
  height = 20,
  color = "#6D7178",
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
    >
      <g clipPath="url(#clip0_25494_47209)">
        <path
          d="M14.7104 5.29183C13.5021 4.0835 11.8437 3.3335 10.0021 3.3335C6.31875 3.3335 3.34375 6.31683 3.34375 10.0002C3.34375 13.6835 6.31875 16.6668 10.0021 16.6668C13.1104 16.6668 15.7021 14.5418 16.4437 11.6668H14.7104C14.0271 13.6085 12.1771 15.0002 10.0021 15.0002C7.24375 15.0002 5.00208 12.7585 5.00208 10.0002C5.00208 7.24183 7.24375 5.00016 10.0021 5.00016C11.3854 5.00016 12.6187 5.57516 13.5187 6.4835L10.8354 9.16683L16.6687 9.16683V3.3335L14.7104 5.29183Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_25494_47209">
          <rect width={20} height={20} fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
