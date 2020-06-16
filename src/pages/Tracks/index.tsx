import React, { useState, useEffect } from "react"

import { useAllQuestData } from "../../contexts/Application"
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
import ScorePill from "../../components/ScorePill"

const MAX_WIDTH = "80%"

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #212121;
  padding-top: 40px;
  width: 100%;
  padding-bottom: 100px;

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
  width: 300px;
  :hover {
    cursor: pointer;
    opacity: 0.7;
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

const QuestDetailsHeader = styled.div`
  border: 1px solid ${({ borderColor }) => borderColor};
  padding: 30px;
  border-radius: 10px;
`

const TierRow = styled(AutoRow)`
  padding: 40px 60px;
  position: relative;
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

  const [showModal, setShowModal] = useState(false)

  const [showQuestDetails, setShowQuestDetails] = useState(false)

  const [trackScore, setTrackScore] = useState(0)

  useEffect(() => {
    if (allQuestData) {
      let newScore = 0
      Object.keys(quests).map((questId) => {
        if (allQuestData[questId]?.progress >= 100) {
          newScore += ALL_QUESTS[questId].definition.points
        }
        return true
      })
      setTrackScore(newScore)
    }
  }, [quests, allQuestData])

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

  const QuestCardEntry = ({ quest, questId, index }) => {
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
          <AutoColumn style={{ width: "100%", marginLeft: "20px" }} gap="10px">
            <RowBetween>
              <Text fontSize={12} color={activeTrack.primaryColor}>
                {quest.name}
              </Text>
              {allQuestData[questId]?.progress && (
                <Text fontSize={12} color={activeTrack.primaryColor}>
                  {allQuestData[questId]?.progress >= 100
                    ? "Completed"
                    : allQuestData[questId]?.progress + "%"}
                </Text>
              )}
            </RowBetween>
            <Text fontSize={16}>{quest.blurb}</Text>
          </AutoColumn>
        </Row>
        <RowBetween
          style={{
            backgroundColor: "#141414",
            padding: "14px 20px",
            borderRadius: "10px",
          }}
        >
          <Text fontSize={14} fontWeight={800} color={activeTrack.primaryColor}>
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
          {allQuestData?.[questId]?.progress >= 100 && (
            <Text
              fontWeight={800}
              fotnSize={14}
              color={activeTrack.primaryColor}
            >
              View Challenge
            </Text>
          )}
        </RowBetween>
      </QuestCard>
    )
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
              {activeQuest?.points}
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
            >{`${trackScore} XP`}</ScoreCard>
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
            <QuestDetailsHeader borderColor={activeTrack.primaryColor}>
              <RowBetween>
                <AutoRow gap="10px">
                  <IconManager iconOption={activeQuest.iconOption} size={40} />
                  <AutoColumn gap="10px">
                    <Text
                      fontWeight={800}
                      fontSize={24}
                      color={activeTrack.primaryColor}
                    >
                      {activeQuest.name}
                    </Text>
                    <Text
                      fontWeight={800}
                      fontSize={16}
                      color={activeTrack.secondaryColor}
                    >
                      {activeQuest.blurb}
                    </Text>
                  </AutoColumn>
                </AutoRow>
                <AutoColumn gap="10px" justify="flex-end">
                  <ScorePill
                    score={trackScore}
                    iconOption={activeTrack.iconOption}
                    color={activeTrack.primaryColor}
                    bg={true}
                    size={16}
                  />
                  <ButtonPrimary style={{ marginTop: "20px" }} width={"180px"}>
                    <Text fontSize={18} fontWeight={800}>
                      Go to dapp
                    </Text>
                  </ButtonPrimary>
                </AutoColumn>
              </RowBetween>
            </QuestDetailsHeader>
            <AutoColumn
              gap="20px"
              justify="flex-start"
              style={{ padding: "0 80px" }}
            >
              <AutoColumn gap="10px">
                <Text color="#676767">Progress</Text>
                <Text fontSize={20} fontWeight={600} color="#D5D5D5">
                  {allQuestData[activeQuest.id]?.progress}%
                </Text>
              </AutoColumn>
              <Text color="#676767">Task Details</Text>
              <Text fontSize={20} fontWeight={600} color="#D5D5D5">
                {activeQuest.description}
              </Text>
              <Text color="#676767">Rewards</Text>
              <ScorePill
                iconOption={activeTrack.iconOption}
                color={activeTrack.primaryColor}
                score={trackScore}
                bg={true}
              />
            </AutoColumn>
          </AutoColumn>
        </QuestDetailsWrapper>
      ) : (
        <TasksWrapper>
          <TierRow>
            <Text
              style={{ position: "absolute", top: 0, left: 0 }}
              fontWeight={800}
              color={activeTrack.primaryColor}
            >
              TIER 1
            </Text>
            {Object.keys(quests)
              .filter((questId) => {
                const quest: QuestDefinition = quests[questId].definition
                return quest.tier === 1
              })
              .map((questId, index) => {
                const quest: QuestDefinition = quests[questId].definition
                return (
                  <QuestCardEntry
                    quest={quest}
                    questId={questId}
                    index={index}
                    key={index}
                  />
                )
              })}
          </TierRow>
        </TasksWrapper>
      )}
    </PageWrapper>
  )
}

export default TrackPage
