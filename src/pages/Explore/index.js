import React from "react"
import styled from "styled-components"
import { AutoColumn } from "../../components/Column"
import { Text } from "rebass"
import { RowFixed, RowBetween } from "../../components/Row"
import IconManager, {
  ICON_OPTIONS,
  ICON_OPTION,
} from "../../components/IconManager"
import { darken } from "polished"

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  width: 90%;
  margin: auto;
  align-items: center;
  justify-content: center;
  padding-top: 80px;

  @media (max-width: 1200px) {
    width: 80%;
  }

  @media (max-width: 970px) {
    width: 90%;
  }

  @media (max-width: 550px) {
    with: 100%;
    padding-top: 5px;
  }
`

const HeaderWrapper = styled(AutoColumn)`
  max-width: 420px;
  text-align: center;
  align-items: center;
`

const TrackSection = styled.div`
  width: 100%;
  max-width: 1240px;
`

const TrackGroup = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
`

const TrackCardWrapper = styled.div`
  border-radius: 5px;
  background-color: ${({ color }) => color};
  padding: 20px;
  width: 28%;
`

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ color }) => darken(0.08, color)};
  border-radius: 5px;
  height: 60px;
  width: 60px;
  padding: 0 8px;
  margin-right: 20px;
`

const Title = styled(Text)`
  color: ${({ fontColor }) => darken(0.3, fontColor)};
`

const ExploreButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  padding: 4px 20px;
  background-color: black;

  :hover {
    cursor: pointer;
    opacity: 0.8;
  }
`

function TrackCard({ color = "", iconOption, title = "", blurb = "" }) {
  return (
    <TrackCardWrapper color={color}>
      <AutoColumn gap="20px">
        <RowFixed style={{ minHeight: "80px" }}>
          <IconWrapper color={color}>
            <IconManager iconOption={iconOption} />
          </IconWrapper>
          <AutoColumn gap="10px">
            <Title fontSize="24px" fontWeight={900} fontColor={color}>
              {title}
            </Title>
            <Title fontSize="12px" fontWeight={500} fontColor={color}>
              {blurb}
            </Title>
          </AutoColumn>
        </RowFixed>
        <RowBetween>
          <div />
          <ExploreButton>
            <Text fontSize={14} fontWeight={900}>
              Explore
            </Text>
          </ExploreButton>
        </RowBetween>
      </AutoColumn>
    </TrackCardWrapper>
  )
}

export default function QuestSection({ account }) {
  return (
    <Wrapper>
      <AutoColumn gap="80px" width="100%" justify="center">
        <HeaderWrapper gap="10px" justify="center">
          <Text fontWeight={900} fontSize={24}>
            <span style={{ color: "#8DFBC9" }}>Rabbit</span>
            <span>Hole</span>
          </Text>
          <Text fontWeight={900} fontSize={24}>
            Build reputation and earn rewards for using decentralized
            applications.
          </Text>
        </HeaderWrapper>
        <TrackSection>
          <Text fontWeight={900} fontSize={24}>
            Explore tracks
          </Text>
          <TrackGroup>
            <TrackCard
              iconOption={ICON_OPTIONS.UNISWAP}
              color={"#F8EAFF"}
              title="Uniswap"
              blurb="Get to know the basics of Uniswap, the exchange for everything."
            />
            <TrackCard
              iconOption={ICON_OPTIONS.COMPOUND}
              color={"#BBE4D8"}
              title="Compound Finance"
              blurb="Get to know the basics of Compound Finance."
            />
            <TrackCard
              iconOption={ICON_OPTIONS.OPEN_SEA}
              color={"#D8F1FF"}
              title="OpenSea"
              blurb="Get to know the basics of OpenSea"
            />
          </TrackGroup>
        </TrackSection>
      </AutoColumn>
    </Wrapper>
  )
}
