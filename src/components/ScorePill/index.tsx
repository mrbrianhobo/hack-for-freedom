import React from "react"
import styled from "styled-components"
import { AutoRow } from "../Row"
import IconManager from "../IconManager"
import { Text } from "rebass"

const PillWrapper = styled(AutoRow)`
  padding: 8px;
  border-radius: 10px;
  background: ${({ bg }) => (bg ? "#212121" : "transparent")};
`

export default function ScorePill({
  score,
  size = 20,
  color = "white",
  iconOption,
  bg = false,
}: {
  score: number
  size?: number
  color?: string
  iconOption?: string
  bg?: boolean
}) {
  return (
    <PillWrapper gap="6px" bg={bg}>
      {iconOption ? <IconManager iconOption={iconOption} size={size} /> : ""}
      <Text fontWeight={800} fontSize={size} color={color}>
        {score} XP
      </Text>
    </PillWrapper>
  )
}
