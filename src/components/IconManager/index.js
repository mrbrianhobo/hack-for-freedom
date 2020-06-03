import React from "react"
import styled from "styled-components"

const Icon = styled.img`
  height: ${({ size }) => size};
  width: ${({ size }) => size};
  background-color: white;
  border-radius: 50%;
  padding: 4px;
`

export const ICON_OPTIONS = {
  COMPOUND: "compound.png",
  UNISWAP: "uniswap.png",
  OPEN_SEA: "opensea.jpg",
}

export default function IconManager({ iconOption, size = "30px" }) {
  return (
    <Icon
      src={require("../../assets/images/" + iconOption)}
      alt="icon"
      size={size}
    />
  )
}
