import React from "react";
import { IconProps } from "./types";

export default function WalletIcon({
  height = 12,
  width = 13,
  color = "#CBCED1",
}: IconProps) {
  return (
    <svg
      width={height}
      height={width}
      viewBox="0 0 13 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2.85333V1.33333C12 0.6 11.4 0 10.6667 0H1.33333C0.593333 0 0 0.6 0 1.33333V10.6667C0 11.4 0.593333 12 1.33333 12H10.6667C11.4 12 12 11.4 12 10.6667V9.14667C12.3933 8.91333 12.6667 8.49333 12.6667 8V4C12.6667 3.50667 12.3933 3.08667 12 2.85333ZM11.3333 4V8H6.66667V4H11.3333ZM1.33333 10.6667V1.33333H10.6667V2.66667H6.66667C5.93333 2.66667 5.33333 3.26667 5.33333 4V8C5.33333 8.73333 5.93333 9.33333 6.66667 9.33333H10.6667V10.6667H1.33333Z"
        fill={color}
      />
    </svg>
  );
}
