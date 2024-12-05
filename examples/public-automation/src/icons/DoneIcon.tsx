import { IconProps } from "./types";

export default function DoneIcon({
  height = 16,
  width = 16,
  color = "inherit",
}: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.99894 10.7996L3.19895 7.99956L2.26562 8.93289L5.99894 12.6662L13.9989 4.66624L13.0656 3.73291L5.99894 10.7996Z"
        fill={color}
      />
    </svg>
  );
}
