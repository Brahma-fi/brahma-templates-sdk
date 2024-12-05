import "react-toastify/dist/ReactToastify.css";

import { useEffect } from "react";
import { toast, Slide, ToastOptions } from "react-toastify";

import ActionIconWrapper from "../ActionIconWrapper";
import { TTypographyType } from "../Typography";
import Toast, { ToastProps } from "../Toast";
import { CloseIcon } from "@/icons";

import * as S from "./styles";

export default function ToastContainer() {
  return (
    <S.StyledToastContainer
      closeButton={CustomCloseButton}
      stacked
      position="bottom-right"
      transition={Slide}
      limit={3}
    />
  );
}

const CustomCloseButton = ({
  closeToast,
}: {
  closeToast: (e: React.MouseEvent<HTMLElement>) => void;
}) => {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeToast(e as any); // react-toastify expect mouse event in arg but keybaord event works as well
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [closeToast]);

  return (
    <ActionIconWrapper onClick={closeToast} size="L">
      <CloseIcon />
    </ActionIconWrapper>
  );
};

type DispatchToastProps = {
  id: string;
  title: string;
  textToCopy?: string;
  link?: string;
  icon?: React.ReactNode | string;
  description?: {
    value?: React.ReactNode | string;
    type?: TTypographyType;
    color?: string;
  };
  type?: ToastProps["type"];
  toastOptions?: ToastOptions;
};

export const dispatchToast = ({
  id,
  title,
  description,
  type,
  icon,
  textToCopy,
  link,
  toastOptions = {
    autoClose: 2500,
  },
}: DispatchToastProps) => {
  if (toast.isActive(id)) return;

  toast(
    <Toast
      type={type}
      title={title}
      textToCopy={textToCopy}
      description={description}
      customIcon={icon}
      link={link}
    />,
    { ...toastOptions, toastId: id }
  );
};
