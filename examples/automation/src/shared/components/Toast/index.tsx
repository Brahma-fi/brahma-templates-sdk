import { CopyIcon, DoneIcon, OpenInNewIcon, TooltipIcon } from "@/icons";
import { defaultTheme } from "@/lib";
import { copyToClipboard, openInNewTab } from "@/utils";
import ActionIconWrapper from "../ActionIconWrapper";
import FlexContainer from "../FlexContainer";
import LogoViewer from "../LogoViewer";
import Typography, { TTypographyType } from "../Typography";

import * as S from "./styles";
import Spinner from "../Spinner";

const TOAST_TYPE_MAPPING: Record<
  ToastType,
  { color: string; icon: React.ReactNode }
> = {
  default: { color: defaultTheme.colors.gray400, icon: <TooltipIcon /> },
  success: { color: defaultTheme.colors.success, icon: <DoneIcon /> },
  error: {
    color: defaultTheme.colors.error,
    icon: <TooltipIcon cursor="default" />,
  },
  warning: { color: defaultTheme.colors.warning, icon: <TooltipIcon /> },
  loading: {
    color: defaultTheme.colors.gray700,
    icon: <Spinner />,
  },
};

type ToastType = "default" | "success" | "warning" | "error" | "loading";

export type ToastProps = {
  title: string;
  customIcon?: React.ReactNode | string;
  type?: ToastType;
  textToCopy?: string;
  link?: string;
  description?: {
    value?: React.ReactNode | string;
    type?: TTypographyType;
    color?: string;
  };
};

export default function Toast({
  title,
  description,
  customIcon,
  textToCopy,
  link,
  type = "default",
}: ToastProps) {
  const copyHandler = (e: React.MouseEvent<HTMLElement>) => {
    e?.stopPropagation();
    copyToClipboard(textToCopy);
  };

  return (
    <S.StyledToast>
      <FlexContainer gap={1.2}>
        <FlexContainer flex={false} alignItems="center">
          <S.ToastIcon color={TOAST_TYPE_MAPPING[type].color}>
            <LogoViewer logo={TOAST_TYPE_MAPPING[type].icon} />
          </S.ToastIcon>
        </FlexContainer>
        <FlexContainer gap={4}>
          <FlexContainer flexDirection="column" width={100} gap={0.2}>
            <Typography type="TITLE_M" color={defaultTheme.colors.gray100}>
              {title}
            </Typography>
            <FlexContainer width={100}>
              {description?.value &&
                (typeof description.value === "string" ? (
                  <Typography
                    type={description?.type ?? "BODY_MEDIUM_XS"}
                    color={description?.color ?? defaultTheme.colors.gray500}
                  >
                    {description.value}
                  </Typography>
                ) : (
                  description.value
                ))}
            </FlexContainer>
          </FlexContainer>
          <FlexContainer flex={false}>
            {link && (
              <ActionIconWrapper onClick={() => openInNewTab(link)} size="L">
                <OpenInNewIcon />
              </ActionIconWrapper>
            )}
            {textToCopy && (
              <ActionIconWrapper onClick={copyHandler} size="L">
                <CopyIcon />
              </ActionIconWrapper>
            )}
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
    </S.StyledToast>
  );
}
