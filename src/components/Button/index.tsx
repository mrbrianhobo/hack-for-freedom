import styled from "styled-components"
import { darken } from "polished"

import { Button as RebassButton } from "rebass/styled-components"

// eslint-disable-next-line no-unexpected-multiline
const Base = styled(RebassButton)<{
  padding?: string
  width?: string
  borderRadius?: string
  altDisbaledStyle?: boolean
}>`
  padding: ${({ padding }) => (padding ? padding : "18px")};
  width: ${({ width }) => (width ? width : "100%")};
  font-weight: 500;
  text-align: center;
  border-radius: 10px;
  border-radius: ${({ borderRadius }) => borderRadius && borderRadius};
  outline: none;
  border: 1px solid transparent;
  color: white;
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  align-items: center;
  cursor: pointer;
  &:disabled {
    cursor: auto;
  }

  > * {
    user-select: none;
  }
`

export const ButtonPrimary = styled(Base)`
  background-color: ${({ theme }) => theme.primary1};
  color: white;
  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.05, theme.primary1)};
    background-color: ${({ theme }) => darken(0.05, theme.primary1)};
  }
  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.primary1)};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.1, theme.primary1)};
    background-color: ${({ theme }) => darken(0.1, theme.primary1)};
  }
`
