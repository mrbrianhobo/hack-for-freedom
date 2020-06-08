import React, { useState } from "react"

import { useAllQuestData, useScore } from "../../contexts/Application"
import firebase from "firebase/app"
import "firebase/database"
import { useWeb3React } from "@web3-react/core"
import { ALL_QUESTS, QuestDefinition, getQuestsFromTrack } from "../../quests"
import styled from "styled-components"
import Row, { AutoRow, RowBetween, RowFixed } from "../../components/Row"

import { Text } from "rebass"
import IconManager from "../../components/IconManager"
import { AutoColumn } from "../../components/Column"
import { ALL_TRACKS, TrackDefinition } from "../../Tracks"
import { Hover } from "../../theme"
import { triggerConfetti } from "../../utils"
import Modal from "../../components/Modal"
import { ButtonPrimary } from "../../components/Button"

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
  margin-top: 20px;
  padding: 40px;
  max-width: calc(80% - 80px);
  background-color: #171717;
  border-radius: 10px;
`

const QuestDetailsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 20px;
  padding: 40px;
  max-width: calc(80% - 80px);
  background-color: #171717;
  border-radius: 10px;
`

const QuestCard = styled.div`
  border: ${({ borderColor }) => `1px solid ${borderColor}`};
  border-radius: 10px;
  width: 260px;
  :hover {
    cursor: pointer;
    box-shadow: ${({ borderColor }) =>
      `0 3px 6px ${borderColor}, 0 3px 6px ${borderColor}`};
  }
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

const SuccessModal = styled(Modal)`
  border: 1px solid #8dfbc9;
  border-radius: 10px;
`

const ModalContent = styled(AutoColumn)`
  border-radius: 10px;
  padding: 40px;
  background-color: black;
  border: 1px solid #8dfbc9;
  width: 100%;
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

  const quests = getQuestsFromTrack(activeTrack.track)

  const [activeQuest, setActiveQuest] = useState(quests[0]?.definition)

  const score = useScore()

  const [showModal, setShowModal] = useState(false)

  const [showQuestDetails, setShowQuestDetails] = useState(false)

  // update to done in db and mark as unredeemable locally
  function redeemPoints(questId: string) {
    let quest = ALL_QUESTS[questId].definition
    firebase
      .database()
      .ref("users/" + account + "/quests/" + quest.name)
      .set(100)
    updateQuestRedeemable(questId, false)
    setShowModal(true)
    triggerConfetti()
  }

  return (
    <PageWrapper>
      <SuccessModal isOpen={showModal} onDismiss={() => setShowModal(false)}>
        <ModalContent gap="40px" justify="center">
          <Text fontSize={30} fontWeight={800}>
            You have earned
          </Text>
          <AutoRow gap="10px">
            <IconManager iconOption={activeTrack.iconOption} />
            <Text
              color={activeTrack.primaryColor}
              fontSize={20}
              fontWeight={800}
            >
              200 XP
            </Text>
          </AutoRow>
          <ButtonPrimary
            width={"240px"}
            style={{ marginTop: "80px" }}
            onClick={() => setShowModal(false)}
          >
            <Text fontSize={20} fontWeight={800}>
              OK
            </Text>
          </ButtonPrimary>
        </ModalContent>
      </SuccessModal>
      <AutoRow gap="10px">
        {ALL_TRACKS.map((track, index) => {
          return (
            <MenuItem
              bg={track.primaryColor}
              key={index}
              onClick={() => {
                setActiveTrack(track)
                setShowQuestDetails(false)
              }}
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
      {showQuestDetails ? (
        <QuestDetailsWrapper>
          <AutoColumn gap="40px" width="100%">
            <RowFixed>
              <Hover>
                <Text
                  onClick={() => {
                    setShowQuestDetails(false)
                  }}
                >
                  ← Back to all tasks
                </Text>
              </Hover>
            </RowFixed>
            <AutoColumn gap="20px" justify="center">
              <Text fontSize={24} fontWeight={800}>
                {activeQuest.name}
              </Text>
              <Text fontSize={14} fontWeight={600}>
                {activeQuest.description}
              </Text>
              <ButtonPrimary style={{ marginTop: "20px" }} width={"300px"}>
                <Text fontSize={18} fontWeight={800}>
                  Go to dapp
                </Text>
              </ButtonPrimary>
            </AutoColumn>
          </AutoColumn>
        </QuestDetailsWrapper>
      ) : (
        <TasksWrapper>
          {Object.keys(quests).map((questId, index) => {
            const quest: QuestDefinition = quests[questId].definition
            return (
              <QuestCard
                borderColor={activeTrack.primaryColor}
                onClick={() => {
                  setShowQuestDetails(true)
                  setActiveQuest(quest)
                }}
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
          })}
        </TasksWrapper>
      )}
    </PageWrapper>
  )
}

export default TrackPage
