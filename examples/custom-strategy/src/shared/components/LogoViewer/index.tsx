import React, { useState } from "react";

import * as S from "./styles";

const genericLogoUrl =
  "https://brahma-static.s3.us-east-2.amazonaws.com/Asset/AssetGENERIC.svg";

type LogoViewerProps = {
  logo?: React.ReactNode | string;
  size?: number;
  roundedBorder?: boolean;
  showOuterBorder?: boolean;
};

export default function LogoViewer({
  logo,
  size = 20,
  roundedBorder = true,
  showOuterBorder = false,
}: LogoViewerProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <S.StyledLogoViewer showOuterBorder={showOuterBorder}>
      {typeof logo === "string" ? (
        <img
          src={imgError ? genericLogoUrl : logo}
          alt={logo}
          height={size}
          onError={() => setImgError(true)}
          width={size}
          style={{ borderRadius: roundedBorder ? "50%" : "0" }}
        />
      ) : (
        logo
      )}
    </S.StyledLogoViewer>
  );
}
