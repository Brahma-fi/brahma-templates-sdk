import { IconProps } from "./types";

export default function TickIcon({
  width = 10,
  height = 8,
  color = "#F8FC53",
}: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 10 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.40837 5.45833L1.47503 3.51667L0.241699 4.75833L3.40837 7.93333L9.52503 1.8L8.2917 0.558334L3.40837 5.45833Z"
        fill={color}
      />
    </svg>
  );
}
