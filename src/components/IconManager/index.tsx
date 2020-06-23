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
  PIGGY: "COMP-101-badge.svg",
}

export default function IconManager({
  iconOption,
  size = 30,
}: {
  iconOption: string
  size?: number
}) {
  if (iconOption) {
    return (
      <Icon
        src={require("../../assets/images/" + iconOption)}
        alt="icon"
        size={size.toString() + "px"}
      />
    )
  } else {
    return <div />
  }
}
