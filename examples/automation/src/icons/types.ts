import { CSSProperties } from "styled-components";

export type IconProps = {
  width?: number;
  height?: number;
  color?: string;
  cursor?: string;
  style?: CSSProperties & Record<string, string>;
  multipleColors?: Record<string, string>;
  onClick?: (any?: any) => void;
};
