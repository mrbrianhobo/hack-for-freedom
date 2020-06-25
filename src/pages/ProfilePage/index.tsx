import React from "react"
import styled from "styled-components"
// import { useAllQuestData } from "../contexts/Application"
import { AutoColumn } from "../../components/Column"
import { RowFixed } from "../../components/Row"
import Identicon from "../../components/Identicon"
import { useWeb3React } from "@web3-react/core"
import { useENSName } from "../../hooks"
import { Text } from "rebass"

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #212121;
  padding-top: 40px;
  width: 100%;
  min-height: 100vh;
  padding-bottom: 100px;

  & > * {
    width: 80%;
  }
`

const DarkCard = styled(AutoColumn)`
  background-color: #131313;
  border-radius: 10px;
  padding: 20px;
  width: 80%;
`

export default function ProfilePage() {
  // const [questData] = useAllQuestData()

  const { account } = useWeb3React()
  const ensName = useENSName(account)

  return (
    <PageWrapper>
      <DarkCard justify="center">
        <RowFixed>
          <Identicon size={40} />
          <AutoColumn gap="10px" style={{ marginLeft: "40px" }}>
            <Text fontWeight={600} color={"#B8B8B8"} fontSize={24}>
              Level 4
            </Text>
            <Text fontWeight={800} fontSize={24}>
              {ensName ? ensName : account}
            </Text>
          </AutoColumn>
        </RowFixed>
      </DarkCard>
    </PageWrapper>
  )
}
