import React, { useState, useEffect } from "react"
import { connect } from '@aragon/connect'
import { Voting } from '@aragon/connect-thegraph-voting'
import { TokenManager } from '@aragon/connect-thegraph-tokens'

import styled from "styled-components"
import Row, { AutoRow, RowBetween } from "../../components/Row"
import { AutoColumn } from "../../components/Column"
import IconManager from "../../components/IconManager"
import { Text } from "rebass"
import { withWeb3 } from "web3-react"
import { stat } from "fs"

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

const ClubBankDiv = ({className, supply}) => {
  return (
    <div>
      <Text
        style={{
          fontSize: "14px",
          marginBottom: "8px",
          color: "#727272"
        }}
      >
        Club Bank Value
      </Text>
      <div className={className}>
        <Text>$732 USD</Text>
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

const MembersDiv = ({className, totalMembers}) => {
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
        <Text>2/{totalMembers} Members</Text>
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

const ContributionDiv = ({ xp, total }) => {
  // xp / total xp * 150 (width of xp bar)
  const fillWidth = (xp / total) * 300
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
          {xp/total*100}%
        </span>
      </Text>
      <XPBar>
        <FilledBar style={{ width: fillWidth }} />
      </XPBar>
    </div>
  )
}

const VotingBar = styled.div`
  position: relative;
  width: 200px;
  height: 14px;
  background: #242424;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 50px;
  margin: 6px;
`

const YesBar = styled.div`
  position: absolute;
  height: 14px;
  background: rgb(44, 198, 143);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 50px;
  margin: 0px;
`

const NoBar = styled.div`
  position: absolute;
  height: 14px;
  background: rgb(255, 105, 105);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 50px;
  margin: 0px;
`

const VotingBarDiv = ({className, yes, no, total }) => {
  const yesWidth = yes / total * 200;
  const noWidth = no / total * 200;
  return (
    <div className={className}>
      <AutoRow>
        <Text>{parseInt(yes/total*100)}%</Text>
        <VotingBar>
          <YesBar style={{ width: yesWidth }} />
        </VotingBar>
      </AutoRow>
      <AutoRow>
        <Text>{parseInt(no/total*100)}%</Text>
        <VotingBar>
          <NoBar style={{ width: noWidth }} />
        </VotingBar>
      </AutoRow>
    </div>
  )
}

const VotingBarSection = styled(VotingBarDiv)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: -30px;
`

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

const ProfileDiv = ({className, supply}) => {
  return (
    <div className={className}>
      <ProfileRow>
        <Name level={3} name={"brian.eth"}/>
        <Score score={150} />
      </ProfileRow>
      <ContributionSection xp={150} total={supply} />
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

const ProposalDetailsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding: 40px;
  background-color: #171717;
  border-radius: 0 0 10px 10px;
`

const Proposal = ({className, activeTrack, showProposalDetails, setShowProposalDetails, setActiveProposal, activeProposal, proposal}) => {
  return (
    <div 
      className={className}
      onClick={() => {
        setShowProposalDetails(!showProposalDetails)
        setActiveProposal(proposal.index)
      }}
    >
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
                Vote #{proposal.index}
              </Text>
            </RowBetween>
          <RowBetween>
            <Text fontSize={16}>{proposal.description.length > 0 ? proposal.description : "Token Minting Event"}</Text>
            <VotingBarSection yes={proposal.yes} no={proposal.no} total={proposal.total} />
          </RowBetween>
          </AutoColumn>
        </Row>
        {(!showProposalDetails || activeProposal!==proposal.index) && (
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
              {proposal.status ? "Passed" : "Rejected"}
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
        {showProposalDetails && activeProposal===proposal.index && (
          <ProposalDetailsWrapper>
            <AutoColumn gap="40px" width="100%">
              <AutoColumn gap="20px" justify="flex-start">
                <AutoColumn gap="10px">
                  <Text color="#676767">Status: </Text>
                  <Text fontSize={20} fontWeight={600} color="#D5D5D5">
                  {proposal.status ? "Passed" : "Rejected"}
                  </Text>
                </AutoColumn>
                <Text color="#676767">Votes Casted</Text>
                <Text fontSize={16} fontWeight={500} color="#D5D5D5">
                  Yes: {parseInt(proposal.yes/(parseInt(proposal.yes)+parseInt(proposal.no))*100)}%
                  No: {parseInt(proposal.no/(parseInt(proposal.yes)+parseInt(proposal.no))*100)}%
                </Text>
              </AutoColumn>
            </AutoColumn>
          </ProposalDetailsWrapper>
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

const tokenBalanceFactor = 1000000000000000000;

export default function Club({ track }) {
  const [activeTrack] = useState(track)
  const [showModal, setShowModal] = useState(false)
  const [showProposalDetails, setShowProposalDetails] = useState(false)
  const [activeProposal, setActiveProposal] = useState(0)
  const [proposals, setProposals] = useState([])
  const [members, setMembers] = useState([])
  const [supply, setSupply] = useState(0)

  useEffect(() => {
    async function getDAOData() {
      // Initiates the connection to an organization
      const org = await connect('briantest.aragonid.eth', 'thegraph', { chainId: 4 })

      // Fetch the apps belonging to this organization
      const apps = await org.apps()
      apps.forEach(console.log)
      
      // Instanciate the Voting app connector using the app address:
      const voting = new Voting(
        "0x19048cb2e95f918c297480b5abdc77c262bccf7b",
        'https://api.thegraph.com/subgraphs/name/aragon/aragon-voting-rinkeby'
      )

      const tokenManager = new TokenManager(
        "0x167517ef0bce84d4b4999ee0a4349373970a1778",
        'https://api.thegraph.com/subgraphs/name/aragon/aragon-tokens-rinkeby'
      )

      const tokens = await tokenManager.token()

      const holders = await tokens.holders()
      setMembers(holders)

      console.log(members)
      const tokenSupply = holders.map(member => parseInt(member.balance)/tokenBalanceFactor).reduce((sum, current) => sum + current, 0)
      setSupply(tokenSupply)

      // Fetch votes of the Voting app
      const votes = await voting.votes()
      const proposals = []
      for (let i = votes.length-1; i >= 0; i--) {
        proposals.push({
          index: i,
          status: votes[i].executed,
          description: votes[i].metadata,
          yes: votes[i].yea,
          no: votes[i].nay,
          total: votes[i].votingPower,
        })
      }
      setProposals(proposals)
      console.log(voting)
      console.log(votes)
      console.log(proposals)

      // const intent = await org.appIntent(voting, 'vote', [votes[0].id, true, true])

      // const [path] = intent.paths("0x7291FcB5EF2bf9770FA031FcB512f126E5809976")

      // for (const transaction of path.transactions) {
      //   await web3.eth.sendTransaction(transaction)
      // }
    }
    getDAOData()
	}, [])

  return (
    <ClubWrapper color={activeTrack.primaryColor} >
      <ClubHeading>
        <ClubBankCard supply={supply} />
        <MembersCard totalMembers={members.length} />
        <ProfileSection supply={supply} />
      </ClubHeading>
      <ClubBody>
        {proposals.map((proposal) => {
          return (
            <ProposalCard 
              activeTrack={activeTrack} 
              showProposalDetails={showProposalDetails}
              setShowProposalDetails={setShowProposalDetails}
              setActiveProposal={setActiveProposal}
              activeProposal={activeProposal}
              proposal={proposal}
            />
        )})}
        
      </ClubBody>
    </ClubWrapper>
  )
}
