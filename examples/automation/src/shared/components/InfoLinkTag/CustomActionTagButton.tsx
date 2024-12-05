import { TagProps } from ".";

import * as S from "./styles";

export default function CustomActionTagButton({
  icon,
  onClick,
  tagColorType = "default",
  hasHoverStyles = true,
}: {
  icon: React.ReactNode;
  tagColorType?: TagProps["tagColorType"];
  hasHoverStyles?: boolean;
  onClick?: () => void;
}) {
  return (
    <S.IconBox
      onClick={(e) => {
        if (!onClick) return;
        onClick();
        e.stopPropagation();
      }}
      tagColorType={tagColorType}
      hasHoverStyles={hasHoverStyles}
    >
      {icon}
    </S.IconBox>
  );
}
