import React, { useState, useEffect } from "react"
import { connect } from '@aragon/connect'

import styled from "styled-components"
import Row, { AutoRow, RowBetween } from "../../components/Row"
import { AutoColumn } from "../../components/Column"
import IconManager from "../../components/IconManager"
import { Text } from "rebass"

const ClubWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
  padding: 40px;
  max-width: calc(80% - 80px);
  // background-color: #171717;
  background: linear-gradient(
    to bottom,
    #171717 0%,
    #171717 250px,
    ${({ color }) => color} 250px,
    ${({ color }) => color} 100%
  );
  border-radius: 10px;
`

const ClubHeading = styled.div`
  font-family: Open Sans;
  font-style: normal;
  font-weight: bold;
  font-size: 36px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  text-align: center;
  color: #e3e3e3;
`

const ClubBody = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 50px;
`

const ClubBankDiv = ({className}) => {
  return (
    <div>
      <Text
        style={{
          fontSize: "14px",
          marginBottom: "8px",
          color: "#727272"
        }}
      >
        Club Total XP
      </Text>
      <div className={className}>
        <Text>200 XP</Text>
      </div>
    </div>
		
	)
}

const ClubBankCard = styled(ClubBankDiv)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 300px;
  height: 150px;
  font-size: 24px;
  line-height: 24px;
  border: 1px solid #C9FFE6;
  border-radius: 10px;
  // margin-right: 80px;
`

const MembersDiv = ({className}) => {
  return (
    <div>
      <Text
        style={{
          fontSize: "14px",
          marginBottom: "8px",
          color: "#727272"
        }}
      >
        Active Members
      </Text>
      <div className={className}>
        <Text>2/2 Members</Text>
      </div>
    </div>
		
	)
}

const MembersCard = styled(MembersDiv)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 300px;
  height: 150px;
  font-size: 24px;
  line-height: 24px;
  border: 1px solid #C9FFE6;
  border-radius: 10px;
  // margin-right: 80px;
`

const Level = styled(Text)`
  font-family: Avenir;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 15px;
  text-align: center;
  padding-bottom: 8px;
  color: #dcdcdc;
`

const NameDiv = ({ className, level, name }) => {
  return (
    <div className={className}>
      <Level >Level {level}</Level>
      <Text>{name}</Text>
    </div>
  )
}

const Name = styled(NameDiv)`
  height: 45px;
  width: 120px;
  max-width: 120px;
  text-align: center;
  font-family: Avenir;
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  line-height: 15px;
  color: #fbfbfb;
  overflow: scroll;
`

const ScoreDiv = ({ className, score }) => {
  return (
    <div className={className}>
      <Text>{score} XP</Text>
    </div>
  )
}

const Score = styled(ScoreDiv)`
  width: 95px;
  height: 30px;
  font-family: Open Sans;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 24px;
  margin-top: "0px";
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1f1f1f;
  border-radius: 5px;
  color: #C9FFE6;
`

const FilledBar = styled.div`
  position: absolute;
  height: 14px;
  background: #8dfbc9;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 50px;
  margin: 0px;
`

const XPBar = styled.div`
  position: relative;
  width: 300px;
  height: 14px;
  background: #242424;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 50px;
  margin: 10px;
`

const ContributionDiv = ({ xp }) => {
  // xp / total xp * 150 (width of xp bar)
  const fillWidth = (xp / 200) * 300
  return (
    <div>
      <Text
        style={{
          fontSize: "14px",
          marginTop: "16px",
          color: "#727272"
        }}
      >
        Your Membership Power:
        <span
          style={{
            fontSize: "18px",
            marginLeft: "6px",
            color: "#fff"
          }}
        >
          75%
        </span>
      </Text>
      <XPBar>
        <FilledBar style={{ width: fillWidth }} />
      </XPBar>
    </div>
  )
}

const ContributionSection = styled(ContributionDiv)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
`

const ProfileRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  width: 80%;
`

const ProfileDiv = ({className}) => {
  return (
    <div className={className}>
      <ProfileRow>
        <Name level={3} name={"brian.eth"}/>
        <Score score={150} />
      </ProfileRow>
      <ContributionSection xp={150} />
    </div>
  )
}

const ProfileSection = styled(ProfileDiv)`
  width: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Proposal = ({className, activeTrack, showProposalDetails}) => {
  return (
    <div className={className}>
      <Row
          gap="10px"
          style={{
            padding: "20px",
            backgroundColor: "#1F1F1F",
            width: "calc(100% - 40px)",
            borderRadius: "10px",
            borderBottomRightRadius: "0",
            borderBottomLeftRadius: "0",
          }}
        >
          <IconManager iconOption={activeTrack.iconOption} />
          <AutoColumn style={{ width: "100%", marginLeft: "20px" }} gap="10px">
            <RowBetween>
              <Text fontSize={12} color={activeTrack.primaryColor}>
                Vote #1
              </Text>
              <Text fontSize={12} color={activeTrack.primaryColor}>
                placeholder
              </Text>
            </RowBetween>
            <Text fontSize={16}>This is a test vote</Text>
          </AutoColumn>
        </Row>
        {!showProposalDetails && (
          <RowBetween
            style={{
              backgroundColor: "#141414",
              padding: "14px 20px",
              borderRadius: "0 0 10px 10px",
            }}
          >
            <Text
              fontSize={14}
              fontWeight={800}
              color={activeTrack.primaryColor}
            >
              [time remaining]
            </Text>
            <Text
              fontWeight={800}
              fotnSize={14}
              color={activeTrack.primaryColor}
            >
              View Proposal
            </Text>
          </RowBetween>
        )}
    </div>
  )
}

const ProposalCard = styled(Proposal)`
  border: #C9FFE6;
  border-radius: 10px;
  width: 100%;
  margin: 12px;
  :hover {
    cursor: pointer;
    opacity: 0.7;
  }
`

export default function Club({ track }) {
  useEffect(() => {
    async function test() {
      // Initiates the connection to an organization
      const org = await connect('briantest.aragonid.eth', 'thegraph', { chainId: 4 })

      // Fetch the apps belonging to this organization
      const apps = await org.apps()
      apps.forEach(console.log)
    }
    test()
	}, [])
	
  const [activeTrack] = useState(track)
  const [showModal, setShowModal] = useState(false)
  const [showProposalDetails, setProposalDetails] = useState(false)

  return (
    <ClubWrapper color={activeTrack.primaryColor} >
      <ClubHeading>
        <ClubBankCard />
        <MembersCard />
        <ProfileSection />
      </ClubHeading>
      <ClubBody>
        <ProposalCard activeTrack={activeTrack} showProposalDetails={showProposalDetails} />
        <ProposalCard activeTrack={activeTrack} showProposalDetails={showProposalDetails} />
      </ClubBody>
    </ClubWrapper>
  )
}
