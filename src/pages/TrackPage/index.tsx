import React, { useState } from "react"

import { useAllQuestData, useScore } from "../../contexts/Application"
import firebase from "firebase/app"
import "firebase/database"
import { useWeb3React } from "@web3-react/core"
import { ALL_QUESTS, QuestDefinition, getTracksFromQuest } from "../../quests"
import styled from "styled-components"
import Row, { AutoRow, RowBetween } from "../../components/Row"

import { Text } from "rebass"
import IconManager from "../../components/IconManager"
import { AutoColumn } from "../../components/Column"
import { ALL_TRACKS, TrackDefinition } from "../../Tracks"
import { Hover } from "../../theme"
import { triggerConfetti } from "../../utils"

const MAX_WIDTH = "80%"

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #212121;
  padding-top: 40px;
  width: 100%;
  height: 100%;

  & > * {
    width: ${MAX_WIDTH};
  }
`

const MenuItem = styled.div`
  padding: 16px 32px;
  background-color: ${({ bg }) => bg};
  border-radius: 10px;

  :hover {
    cursor: pointer;
    opacity: 1;
  }

  opacity: ${({ active }) => (active ? "1" : "0.4")};
`

const Header = styled(AutoRow)`
  border-radius: 10px;
  background-color: ${({ bg }) => bg};
  width: calc(${MAX_WIDTH} - 40px);
  margin-top: 40px;
  padding: 20px;
  min-height: 120px;
`

const ScoreCard = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 6px 12px;
  background-color: black;
  color: ${({ color }) => color};
  font-weight: 800;
  border-radius: 8px;
  font-size: 12px;
`

const TasksWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: ${MAX_WIDTH};
  margin-top: 20px;
`

const QuestSection = styled.div`
  padding: 60px 20px;
  width: calc(70% - 40px);
  background-color: #171717;
`

const DetailsSection = styled.div`
  padding: 60px 20px;
  width: calc(30% - 40px);
  background-color: #0e0e0e;
`

const QuestCard = styled.div`
  border: ${({ borderColor }) => `1px solid ${borderColor}`};
  border-radius: 10px;
  width: 260px;
`

const RedeemButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 6px 30px;
  background-color: ${({ backgroundColor }) => backgroundColor};
  color: black;
  font-weight: 800;
  border-radius: 8px;
  font-size: 12px;

  :hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

enum Section {
  Tasks,
  Leaderboard,
}

function TrackPage() {
  const { account } = useWeb3React()

  const [allQuestData, updateQuestRedeemable] = useAllQuestData()

  const [activeTrack, setActiveTrack] = useState<TrackDefinition>(ALL_TRACKS[0])

  const [activeSection, setActiveSection] = useState(Section.Tasks)

  const score = useScore()

  // update to done in db and mark as unredeemable locally
  function redeemPoints(questId: string) {
    let quest = ALL_QUESTS[questId].definition
    firebase
      .database()
      .ref("users/" + account + "/quests/" + quest.name)
      .set(100)
    updateQuestRedeemable(questId, false)
    triggerConfetti()
  }

  return (
    <PageWrapper>
      <AutoRow gap="10px">
        {ALL_TRACKS.map((track, index) => {
          return (
            <MenuItem
              bg={track.primaryColor}
              key={index}
              onClick={() => setActiveTrack(track)}
              active={activeTrack === track}
            >
              <Text color={track.secondaryColor} fontWeight={800} fontSize={14}>
                {track.name.toLocaleUpperCase()}
              </Text>
            </MenuItem>
          )
        })}
      </AutoRow>
      <Header bg={activeTrack.primaryColor} gap="10px">
        <IconManager iconOption={activeTrack.iconOption} />
        <AutoColumn gap="4px">
          <AutoRow gap="6px">
            <Text
              fontSize={30}
              fontWeight={900}
              color={activeTrack.secondaryColor}
            >
              {activeTrack.name}
            </Text>
            <ScoreCard
              color={activeTrack.primaryColor}
            >{`${score} XP`}</ScoreCard>
          </AutoRow>
          <Text
            fontSize={14}
            fontWeight={600}
            color={activeTrack.secondaryColor}
            style={{ maxWidth: "400px" }}
          >
            {activeTrack.description}
          </Text>
        </AutoColumn>
      </Header>
      <AutoRow gap="10px" style={{ marginTop: "40px" }}>
        <Hover>
          <Text
            fontWeight={800}
            color={activeSection === Section.Tasks ? "white" : "#727272"}
            onClick={() => setActiveSection(Section.Tasks)}
          >
            Task Overview
          </Text>
        </Hover>
        <Hover>
          <Text
            fontWeight={800}
            color={activeSection === Section.Leaderboard ? "white" : "#727272"}
            onClick={() => setActiveSection(Section.Leaderboard)}
          >
            Leaderboard
          </Text>
        </Hover>
      </AutoRow>
      <TasksWrapper>
        <QuestSection>
          {Object.keys(getTracksFromQuest(activeTrack.track)).map(
            (questId, index) => {
              const quest: QuestDefinition = getTracksFromQuest(
                activeTrack.track
              )[questId].definition
              return (
                <QuestCard
                  borderColor={activeTrack.primaryColor}
                  onClick={() => {}}
                  key={index}
                >
                  <Row
                    gap="10px"
                    style={{
                      padding: "20px",
                      backgroundColor: "#1F1F1F",
                      width: "calc(100% - 40px)",
                      borderRadius: "10px",
                    }}
                  >
                    <IconManager iconOption={activeTrack.iconOption} />
                    <AutoColumn
                      style={{ maxWidth: "160px", marginLeft: "20px" }}
                      gap="10px"
                    >
                      <Text fontSize={10} color={activeTrack.primaryColor}>
                        {quest.name}
                      </Text>
                      <Text fontSize={16}>{quest.description}</Text>
                    </AutoColumn>
                  </Row>
                  <RowBetween
                    style={{
                      backgroundColor: "#141414",
                      padding: "14px 20px",
                      borderRadius: "10px",
                    }}
                  >
                    <Text
                      fontSize={12}
                      fontWeight={800}
                      color={activeTrack.primaryColor}
                    >
                      {quest.points} XP
                    </Text>
                    {allQuestData?.[questId]?.redeemable && (
                      <RedeemButton
                        backgroundColor={activeTrack.primaryColor}
                        onClick={() => redeemPoints(questId)}
                      >
                        Redeem
                      </RedeemButton>
                    )}
                  </RowBetween>
                </QuestCard>
              )
            }
          )}
        </QuestSection>
        <DetailsSection></DetailsSection>
      </TasksWrapper>
    </PageWrapper>
  )
}

export default TrackPage
