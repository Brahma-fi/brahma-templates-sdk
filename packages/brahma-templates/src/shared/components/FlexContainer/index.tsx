import styled, { css } from "styled-components";
import media from "styled-media-query";

export type FlexContainerProps = {
  flexDirection?:
    | "row"
    | "row-reverse"
    | "column"
    | "column-reverse"
    | "initial"
    | "inherit";

  justifyContent?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly"
    | "initial"
    | "inherit";

  alignItems?:
    | "stretch"
    | "center"
    | "flex-start"
    | "flex-end"
    | "baseline"
    | "space-between"
    | "space-around"
    | "space-evenly"
    | "initial"
    | "inherit";

  gap?: number;
  mobileGap?: number;
  flex?: boolean;
  width?: number;
  height?: number;
  padding?: string;
  style?: Record<string, string>;
  opacityInEffect?: boolean;
  bgColor?: string;
  hoverBgColor?: string;
  borderRadius?: number;
  borderColor?: string;
  hoverBorderColor?: string;
  cursor?: string;
};

const FlexContainer = styled.div<FlexContainerProps>`
  ${({
    flexDirection = "row",
    justifyContent = "flex-start",
    alignItems = "flex-start",
    flex = true,
    gap,
    mobileGap,
    width,
    height,
    padding,
    style,
    bgColor,
    borderRadius,
    hoverBgColor,
    borderColor,
    hoverBorderColor,
    cursor,
  }) => css`
    display: flex;
    flex-direction: ${flexDirection};
    justify-content: ${justifyContent};
    align-items: ${alignItems};
    transition: background-color "0.3s ease-in-out", border "0.3s ease-in-out";
    ${flex && "flex: 1"};
    ${!!gap && `gap: ${gap}rem`};
    ${!!width && `width: ${width}%`};
    ${!!height && `height: ${height}%`};
    ${!!padding && `padding: ${padding}`};
    ${!!bgColor && `background-color:${bgColor}`};
    ${!!borderColor && `border: 1px solid ${borderColor}`};
    ${!!borderRadius && `border-radius: ${borderRadius}rem`};
    ${!!cursor && `cursor: ${cursor}`};
    ${!!style && style};

    &:hover {
      ${!!hoverBgColor && `background-color:${hoverBgColor}`};
      ${!!hoverBorderColor && `border: 1px solid ${hoverBorderColor}`};
    }

    ${media.lessThan("medium")`
       ${!!mobileGap && `gap: ${mobileGap}rem`};
    `}
  `}
`;

export default FlexContainer;
