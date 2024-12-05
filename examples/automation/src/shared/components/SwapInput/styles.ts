import styled, { css } from 'styled-components'

export const SwapInputLoaderContainer = styled.div`
  width: 112px;
  height: 28px;
`

export const SwapQuoteDollarLoader = styled.div`
  width: 64px;
`

export const MaxSectionWrapper = styled.div`
  ${({ theme }) => css`
    cursor: pointer;
    p {
      transition: color ${theme.transition.default};
    }

    &:hover {
      p {
        color: ${theme.colors.gray400};
      }
    }
  `}
`
