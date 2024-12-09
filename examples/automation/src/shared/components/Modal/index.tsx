import React from "react";

import * as S from "./styles";

type ModalProps = {
  children: React.ReactNode;
  isOpen: boolean;
  onClickOutside?: () => void;
  overlay?: boolean;
  top?: number;
  zIndex?: number;
  isCenterAligned?: boolean;
  marginBottom?: string;
};

export default function Modal({
  children,
  isOpen,
  onClickOutside,
  top = 20,
  zIndex,
  overlay = true,
  isCenterAligned = true,
  marginBottom,
}: ModalProps) {
  // useEffect(() => {
  //   if (isOpen) {
  //     document.body.style.overflowY = 'hidden'
  //   } else {
  //     document.body.style.overflowY = 'auto'
  //   }
  // }, [isOpen])

  return (
    <S.ModalWrapper isOpen={isOpen} zIndex={zIndex} overlay={overlay}>
      <S.ModalContent
        top={top}
        isCenterAligned={isCenterAligned}
        marginBottom={marginBottom}
        onClick={() => {
          onClickOutside && onClickOutside();
        }}
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {children}
        </div>
      </S.ModalContent>
    </S.ModalWrapper>
  );
}
