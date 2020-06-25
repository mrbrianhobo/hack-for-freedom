import React, { useState } from "react"
import styled from "styled-components"
import { Text } from "rebass"
import { ButtonPrimary } from "../Button"

const LeaderboardWrapper = styled.div`
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
    #171717 300px,
    ${({ color }) => color} 300px,
    ${({ color }) => color} 100%
  );
  border-radius: 10px;
`

const LeaderboardHeading = styled.div`
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

const LeaderboardBody = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const UserScoreDiv = ({ className, color, score }) => {
  return (
    <div className={className}>
      <Text>YOUR SCORE</Text>
      <Score color={color} score={score} />
    </div>
  )
}

const UserScore = styled(UserScoreDiv)`
  font-family: Open Sans;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: #e3e3e3;
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
  margin-top: ${({ isLeader }) =>
    isLeader === undefined || false ? "6px" : "0px"};
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1f1f1f;
  border-radius: 5px;
  color: ${({ color }) => color};
`

const Level = styled(Text)`
  font-family: Avenir;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 15px;
  text-align: ${({ isLeader }) =>
    isLeader === undefined || false ? "left" : "center"};
  padding-bottom: 8px;
  color: #dcdcdc;
`

const NameDiv = ({ className, level, name, isLeader }) => {
  return (
    <div className={className}>
      <Level isLeader={isLeader}>Level {level}</Level>
      <Text>{name}</Text>
    </div>
  )
}

const Name = styled(NameDiv)`
  height: 45px;
  width: 120px;
  max-width: 120px;
  text-align: ${({ isLeader }) =>
    isLeader === undefined || false ? "left" : "center"};
  font-family: Avenir;
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  line-height: 15px;
  color: #fbfbfb;
  overflow: scroll;
`

const Avatar = styled.div`
  margin-top: ${({ isLeader }) =>
    isLeader === undefined || false ? "0px" : "-30px"};
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: ${({ backgroundColor }) => backgroundColor};
`

const Medal = styled.div`
  width: 60px;
  height: 60px;
`

const LeaderScoreRowDiv = ({ className, color, score }) => {
  return (
    <div className={className}>
      <Score isLeader={true} color={color} score={score} />
      <Text
        style={{
          width: "100px",
        }}
      >
        View Profile
      </Text>
    </div>
  )
}

const LeaderScoreRow = styled(LeaderScoreRowDiv)`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  padding: 8px;
`

const TopLeaderCardDiv = ({ className, color, rank, level, name, score }) => {
  return (
    <div className={className}>
      <Avatar backgroundColor={color} isLeader={true} />
      <Name isLeader={true} level={level} name={name} />
      <Medal rank={rank} />
      <LeaderScoreRow color={color} score={score} />
    </div>
  )
}

const TopLeaderCard = styled(TopLeaderCardDiv)`
  width: 250px;
  height: 220px;
  margin: 20px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  font-family: Open Sans;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 24px;

  background: #1f1f1f;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25),
    inset 0px 1px 4px rgba(141, 251, 201, 0.05);
  border-radius: 10px;
`

const LeaderCardRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const LeaderboardCardDiv = ({ className, color, rank, level, name, score }) => {
  return (
    <div className={className}>
      <Text style={{ width: "8%", fontSize: "16px" }}>{rank}</Text>
      <Avatar backgroundColor={color} />
      <Name level={level} name={name} />
      <Score color={color} score={score} />
      <Text style={{ width: "20%" }}>View Profile</Text>
    </div>
  )
}

const LeaderboardCard = styled(LeaderboardCardDiv)`
  width: 570px;
  height: 100px;
  margin: 16px;
  font-family: Open Sans;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 24px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  text-align: center;
  background: #1f1f1f;
  border-radius: 20px;
`

const ViewButton = styled(ButtonPrimary)`
  width: 160px;
  height: 50px;
  margin: 16px;
  font-family: Open Sans;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 30px;
`

const Separator = styled.hr`
  margin: 30px auto;
  width: 70%;
  border: 1px solid rgba(255, 255, 255, 0.1);
`

const leaderboardWithUser = {
  user: {
    position: 135,
    name: "scottoshi.eth",
    imageUrl: "ethmoji_sample.png",
    points: 200,
    onLeaderboard: false,
  },
  leaders: [
    {
      name: "scottrepreneur.eth",
      imageUrl: "ethmoji_sample.png",
      level: 2,
      points: 1000,
    },
    {
      name: "vitalik.eth",
      imageUrl: "ethmoji_sample.png",
      level: 2,
      points: 999,
    },
    {
      name: "flynn.eth",
      imageUrl: "ethmoji_sample.png",
      level: 2,
      points: 988,
    },
    {
      name: "eric.eth",
      imageUrl: "ethmoji_sample.png",
      level: 2,
      points: 900,
    },
    {
      name: "ismoney.eth",
      imageUrl: "ethmoji_sample.png",
      level: 2,
      points: 850,
    },
    {
      name: "rainbow.eth",
      imageUrl: "ethmoji_sample.png",
      level: 2,
      points: 800,
    },
    {
      name: "stan36.eth",
      imageUrl: "ethmoji_sample.png",
      level: 2,
      points: 700,
    },
    {
      name: "matthew.cent.eth",
      imageUrl: "ethmoji_sample.png",
      level: 2,
      points: 600,
    },
    {
      name: "toast.eth",
      imageUrl: "ethmoji_sample.png",
      level: 2,
      points: 500,
    },
    {
      name: "defidude.eth",
      imageUrl: "ethmoji_sample.png",
      level: 2,
      points: 400,
    },
  ],
}

export default function Leaderboard({ track }) {
  const [activeTrack] = useState(track)

  return (
    <LeaderboardWrapper color={activeTrack.primaryColor}>
      <LeaderboardHeading>
        <Text>Leaderboard</Text>
        <UserScore
          color={activeTrack.primaryColor}
          score={leaderboardWithUser.user.points}
        />
      </LeaderboardHeading>
      <Separator />
      <LeaderboardBody>
        <LeaderCardRow>
          {leaderboardWithUser.leaders.map((leader, i) => {
            if (i < 3) {
              return (
                <TopLeaderCard
                  color={activeTrack.primaryColor}
                  rank={i + 1}
                  level={leader.level}
                  name={leader.name}
                  score={leader.points}
                />
              )
            }
            return true
          })}
        </LeaderCardRow>
        {leaderboardWithUser.leaders.map((leader, i) => {
          if (i > 2) {
            return (
              <LeaderboardCard
                color={activeTrack.primaryColor}
                rank={i + 1}
                level={leader.level}
                name={leader.name}
                score={leader.points}
              />
            )
          }
          return true
        })}
      </LeaderboardBody>
      <ViewButton>View More</ViewButton>
    </LeaderboardWrapper>
  )
}
