import styled, { css } from 'styled-components'

export const StyledTooltipBox = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  &.pre-hovered > div:first-of-type {
    transition-delay: 0s;
    opacity: 100;
    visibility: visible;
  }

  &:hover > div:first-of-type {
    transition-delay: 0s;
    opacity: 100;
    visibility: visible;
  }
`
