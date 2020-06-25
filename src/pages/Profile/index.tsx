import React, { useState } from "react"
import styled from "styled-components"
import { AutoColumn } from "../../components/Column"
import Row, { RowFixed, RowBetween, AutoRow } from "../../components/Row"
import Identicon from "../../components/Identicon"
import { Search } from "react-feather"
import { Text } from "rebass"
import { useWeb3React } from "@web3-react/core"
import { useENSName } from "../../hooks"
import { useUserDbData, useAllQuestData } from "../../contexts/Application"
import { ALL_TRACKS, TrackDefinition } from "../../Tracks"
import { getQuestsFromTrack, getTotalXpFromTrack } from "../../quests"
import IconManager from "../../components/IconManager"

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #212121;
  padding-top: 40px;
  width: 100%;
  min-height: 100vh;
  padding-bottom: 100px;
`

const DarkCard = styled(AutoColumn)`
  background-color: #131313;
  border-radius: 10px;
  padding: 40px;
`

const Break = styled.div`
  height: 1px;
  background-color: #2b2b2b;
  width: 100%;
`

const ActivitySection = styled(AutoColumn)`
  padding: 40px 100px;
`

const TrackWrapper = styled.div`
  width: 300px;
  padding: 10px;
`

const XpWrapper = styled.div`
  width: 300px;
  padding: 10px;
  text-align: center;
`

const SearchWrapper = styled(AutoRow)`
  background-color: #131313;
  padding: 6px 16px;
  border-radius: 10px;
`

const StyledInput = styled.input`
  background-color: transparent;
  outline: none;
  border: none;
  width: 240px;
  color: white;
  ::placeholder {
    color: #4e4e4e;
  }
`

const StyledSearch = styled(Search)`
  height: 16px;
  width: 16px;
  & > * {
    stroke: #4e4e4e;
  }
`

const ImportButton = styled.div`
  padding: 6px 16px;
  background-color: #4e4e4e;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;

  :hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

export default function ProfilePage() {
  const [questData] = useAllQuestData()

  const { account } = useWeb3React()
  const ensName = useENSName(account)

  const [searchVal, setSearchVal] = useState("")
  const [customUser, setCustomUser] = useState("")
  const [overrideAccount, setOverrideAccount] = useState(false)

  // fetch user data from db store if we have it
  const dbData = useUserDbData()
  const userDbData = dbData?.[overrideAccount ? customUser : account]

  function getTrackProgress(track) {
    let progress = 0
    let trackQuests = getQuestsFromTrack(track.track)
    Object.keys(trackQuests).map((questId) => {
      if (overrideAccount && userDbData?.quests?.[questId]) {
        progress = progress + userDbData?.quests?.[questId]
      } else if (!overrideAccount && questData?.[questId]?.progress) {
        progress = progress + questData?.[questId]?.progress
      }
      return true
    })
    return progress
  }

  return (
    <PageWrapper>
      <AutoColumn gap="20px">
        <RowBetween>
          <AutoRow gap="6px">
            <SearchWrapper gap="4px">
              <StyledSearch />
              <StyledInput
                placeholder="Search for an address..."
                value={searchVal}
                onChange={(e) => {
                  setSearchVal(e.target.value)
                }}
              />
            </SearchWrapper>
            {dbData?.[searchVal]?.quests && (
              <ImportButton
                onClick={() => {
                  setOverrideAccount(true)
                  setCustomUser(searchVal)
                  setSearchVal("")
                }}
              >
                <Text fontWeight={600} fontSize={12}>
                  Import User
                </Text>
              </ImportButton>
            )}
            {!dbData?.[searchVal]?.quests && searchVal !== "" && (
              <Text fontWeight={600} fontSize={12}>
                No user found
              </Text>
            )}
          </AutoRow>
          {overrideAccount ? (
            <ImportButton
              onClick={() => {
                setOverrideAccount(false)
                setCustomUser("")
                setSearchVal("")
              }}
            >
              <Text fontWeight={600} fontSize={12}>
                Clear Imported User
              </Text>
            </ImportButton>
          ) : (
            <div />
          )}
        </RowBetween>
        <DarkCard justify="center">
          <RowFixed>
            <Identicon size={40} />
            <AutoColumn gap="10px" style={{ marginLeft: "40px" }}>
              <Text fontWeight={600} color={"#B8B8B8"} fontSize={24}>
                Level 4
              </Text>
              <Text fontWeight={800} fontSize={24}>
                {customUser ? customUser : ensName ? ensName : account}
              </Text>
            </AutoColumn>
          </RowFixed>
        </DarkCard>
        <DarkCard justify="center">
          <RowBetween style={{ width: "100%" }}>
            <Text>Activity</Text>
            <div />
          </RowBetween>
          <ActivitySection gap="20px">
            <RowFixed>
              <TrackWrapper>
                <Text textAlign="center">App</Text>
              </TrackWrapper>
              <XpWrapper>
                <Text textAlign="center">Progress</Text>
              </XpWrapper>
            </RowFixed>
            <Break />
            {ALL_TRACKS.map((track: TrackDefinition, i) => {
              return (
                <RowFixed key={i}>
                  <TrackWrapper>
                    <Text
                      textAlign="center"
                      fontWeight={900}
                      color={track.primaryColor}
                    >
                      {track.name}
                    </Text>
                  </TrackWrapper>
                  <XpWrapper>
                    <Row gap="6px" justify="center">
                      <IconManager iconOption={track.iconOption} size={16} />
                      <Text
                        textAlign="center"
                        fontWeight={900}
                        color={track.primaryColor}
                        ml={2}
                      >{`${getTrackProgress(track)} / ${getTotalXpFromTrack(
                        track.track
                      )} XP`}</Text>
                    </Row>
                  </XpWrapper>
                </RowFixed>
              )
            })}
          </ActivitySection>
        </DarkCard>
      </AutoColumn>
    </PageWrapper>
  )
}
