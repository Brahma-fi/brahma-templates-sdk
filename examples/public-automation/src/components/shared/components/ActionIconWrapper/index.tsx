import { defaultTheme } from "@/lib";
import * as S from "./styles";

export type ActionButtonSizes = "S" | "M" | "L" | "FULL" | "XL";

type ActionIconWrapperProps = {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  padding?: string;
  color?: string;
  hoverColor?: string;
  size?: ActionButtonSizes;
  disabled?: boolean;
  style?: React.CSSProperties;
};
export default function ActionIconWrapper({
  color = defaultTheme.colors.gray500,
  hoverColor = defaultTheme.colors.gray300,
  size = "S",
  onClick,
  disabled,
  children,
  style,
}: ActionIconWrapperProps) {
  return (
    <S.StyledActionIconWrapper
      onClick={(e) => {
        if (disabled) return;
        onClick && onClick(e);
        e.stopPropagation();
      }}
      color={color}
      hoverColor={hoverColor}
      size={size}
      disabled={disabled}
      style={style}
    >
      {children}
    </S.StyledActionIconWrapper>
  );
}
