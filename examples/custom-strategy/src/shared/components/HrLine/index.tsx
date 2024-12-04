import { defaultTheme } from "@/lib";

import * as S from "./styles";

type HrLineProps = {
  color?: string;
  paddingX?: number;
};

export default function HrLine({
  color = defaultTheme.colors.gray700,
  paddingX = 0,
}: HrLineProps) {
  return (
    <S.StyledHrLine paddingX={paddingX}>
      <S.HeaderLine color={color} />
    </S.StyledHrLine>
  );
}
