import { IconProps } from "./types";

export default function LinkIcon({
  width = 14,
  height = 14,
  color = "#A8ADB5",
}: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 12 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.6667 11.1667H1.33333V1.83333H6V0.5H1.33333C0.593333 0.5 0 1.1 0 1.83333V11.1667C0 11.9 0.593333 12.5 1.33333 12.5H10.6667C11.4 12.5 12 11.9 12 11.1667V6.5H10.6667V11.1667ZM7.33333 0.5V1.83333H9.72667L3.17333 8.38667L4.11333 9.32667L10.6667 2.77333V5.16667H12V0.5H7.33333Z"
        fill={color}
      />
    </svg>
  );
}
