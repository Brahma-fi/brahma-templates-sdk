import * as S from "./styles";

export default function ContentWrapper({
  children,
  borderRadius,
  style,
  padding = "1.2rem 1.6rem",
  showOpacityIn = false,
}: {
  borderRadius?: string;
  padding?: string;
  children: React.ReactNode;
  style?: Record<string, string | number>;
  showOpacityIn?: boolean;
}) {
  return (
    <S.StyledContentWrapper
      showOpacityIn={showOpacityIn}
      padding={padding}
      style={{ borderRadius: borderRadius || "0", ...style }}
    >
      {children}
    </S.StyledContentWrapper>
  );
}
