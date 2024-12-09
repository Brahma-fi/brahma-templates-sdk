import FlexContainer from "../FlexContainer";
import { dispatchToast } from "../ToastContainer";
import TooltipBox, { TooltipBoxProps } from "../TooltipBox";
import Typography from "../Typography";

import * as S from "./styles";
import { copyToClipboard, openInNewTab, openInSameTab } from "@/utils";
import { CopyIcon, OpenInNewIcon, TooltipIcon } from "@/icons";
import { defaultTheme } from "@/lib";

export type TagProps = {
  tagColorType?:
    | "default"
    | "console"
    | "warning"
    | "error"
    | "blast"
    | "success";
  content: string | React.ReactNode;
  link?: string;
  leftIcon?: React.ReactNode;
  rightSlot?: React.ReactNode;
  openLinkInNewTab?: boolean;
  textToCopy?: string;
  toolTipContent?: string;
  toolTipDirection?: TooltipBoxProps["direction"];
};

export type InfoLinkTagProps = TagProps;

export default function InfoLinkTag({
  content,
  link,
  leftIcon,
  toolTipContent,
  toolTipDirection,
  rightSlot,
  openLinkInNewTab = true,
  tagColorType = "default",
  textToCopy,
}: InfoLinkTagProps) {
  const tagProps = {
    content,
    link,
    leftIcon,
    rightSlot,
    openLinkInNewTab,
    tagColorType,
    textToCopy,
    toolTipContent,
    toolTipDirection,
  };
  return <Tag {...tagProps} />;
}

function Tag({
  content,
  link,
  leftIcon,
  rightSlot,
  openLinkInNewTab,
  tagColorType,
  textToCopy,
  toolTipContent,
  toolTipDirection,
}: TagProps) {
  const copyHandler = (e: React.MouseEvent<HTMLElement>) => {
    e?.stopPropagation();
    copyToClipboard(textToCopy || link);
    dispatchToast({
      title: "Content copied",
      description: { value: textToCopy || link },
      icon: <CopyIcon />,
      type: "success",
      id: textToCopy || link || "",
    });
  };
  const hasLeftSection = !!leftIcon;

  const hasRightSection = !!rightSlot;

  return (
    <S.StyledTagComponent>
      {hasLeftSection && (
        <FlexContainer padding="0 0.4rem 0 0.4rem">
          {leftIcon || (
            <TooltipIcon color={defaultTheme.colors.gray300} cursor="default" />
          )}
        </FlexContainer>
      )}

      <TooltipBox
        tooltipWidth={80}
        direction={toolTipDirection}
        content={toolTipContent}
      >
        <S.ContentWrapper
          tagColorType={tagColorType}
          isCustomComponent={typeof content !== "string"}
          hasLeftBorder={hasLeftSection}
        >
          {typeof content === "string" ? (
            <Typography type="BODY_MEDIUM_XS">{content}</Typography>
          ) : (
            content
          )}
        </S.ContentWrapper>
      </TooltipBox>

      {hasRightSection && rightSlot}

      {textToCopy && (
        <S.IconBox
          hasHoverStyles
          onClick={copyHandler}
          id="copy"
          tagColorType={tagColorType}
        >
          <CopyIcon color={defaultTheme.colors.gray400} />
        </S.IconBox>
      )}

      {link && (
        <S.IconBox
          id="link"
          hasHoverStyles
          onClick={(e) => {
            if (!link) return;
            e.stopPropagation();
            openLinkInNewTab ? openInNewTab(link) : openInSameTab(link);
          }}
          tagColorType={tagColorType}
        >
          <OpenInNewIcon color={defaultTheme.colors.gray400} />
        </S.IconBox>
      )}
    </S.StyledTagComponent>
  );
}
