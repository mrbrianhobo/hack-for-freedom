import React, { useState } from "react"

import { useAllQuestData } from "../contexts/Application"
import firebase from "firebase/app"
import "firebase/database"
import { useWeb3React } from "@web3-react/core"
import { ALL_QUESTS } from "../quests"
import styled from "styled-components"
import { AutoRow, RowBetween } from "../components/Row"
import { ALL_TRACKS } from "../constants"
import { Text } from "rebass"
import { darken } from "polished"

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 100px;
  width: 100%;

  & > * {
    width: 80%;
  }
`

const MenuItem = styled.div`
  padding: 16px 32px;
  background-color: ${({ bg }) => bg};
  border-radius: 10px;

  :hover {
    cursor: pointer;
    background-color: ${({ bg }) => darken(0.2, bg)};
  }
`

const Header = styled(RowBetween)`
  border-radius: 10px;
  background-color: ${({ bg }) => bg};
  padding: 40px 20px;
  width: 80%;
  margin-top: 40px;
`

function Tracks() {
  const { account } = useWeb3React()

  const [, updateQuestRedeemable] = useAllQuestData()

  const [activeTrack, setActiveTrack] = useState(ALL_TRACKS[0])

  // update to done in db and mark as unredeemable locally
  function redeemPoints(questId) {
    let quest = ALL_QUESTS[questId].definition
    firebase
      .database()
      .ref("users/" + account + "/quests/" + quest.name)
      .set(100)
    updateQuestRedeemable(questId, false)
  }

  return (
    <PageWrapper>
      <AutoRow>
        {ALL_TRACKS.map((track, index) => {
          return (
            <MenuItem bg={track.primaryColor} key={index}>
              <Text color={track.secondaryColor} fontWeight={800} fontSize={14}>
                {track.name.toLocaleUpperCase()}
              </Text>
            </MenuItem>
          )
        })}
      </AutoRow>
      <Header bg={activeTrack.primaryColor}></Header>
    </PageWrapper>
  )
}

export default Tracks
