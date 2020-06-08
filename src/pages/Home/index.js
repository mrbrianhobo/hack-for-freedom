import React from "react"
import styled from "styled-components"
import ExplorePage from "../Explore"
import { useWeb3React } from "@web3-react/core"
import { AutoColumn } from "../../components/Column"
import { Text, Button } from "rebass"
import { RowBetween, RowFixed } from "../../components/Row"
import { useWalletModalToggle } from "../../contexts/Application"
import { Link } from "../../theme/components"

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const LoggedOut = styled.div`
  margin-top: 200px
  padding-left: 20%;
  width: 60%;
`

const StyledButtonDark = styled(Button)`
  background-color: white;
  color: black;
  > * {
    font-weight: 1000;
  }

  :focus {
    outline: none;
  }

  :hover {
    cursor: pointer;
    background-color: #dcdcdc;
  }
`

const Logo = styled.img`
  width: 150px;
`

export default function Home() {
  const { account } = useWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  return (
    <Wrapper>
      {account ? (
        <ExplorePage account={account} />
      ) : (
        <LoggedOut>
          <AutoColumn gap="40px">
            <Logo
              src={require("../../assets/images/rabbithole.png")}
              alt="rabbithole logo"
            />
            <Text fontSize="30px" fontWeight={1000}>
              Adventure into the world of crypto and get rewarded for using it.
            </Text>
            <RowBetween>
              <StyledButtonDark
                height="60px"
                width="300px"
                onClick={() => toggleWalletModal()}
              >
                <Text fontSize="20px" fontWeight={600} color="black">
                  Connect a wallet to enter
                </Text>
              </StyledButtonDark>
            </RowBetween>
            <Link href="/faq">
              <Text color="#6fcf97">Have questions?</Text>
            </Link>
            <RowFixed>
              <a
                href="https://twitter.com/rabbithole_gg"
                style={{ textDecoration: "none" }}
              >
                <Text color="#6fcf97">Twitter</Text>
              </a>
              <a
                href="https://discord.gg/V7WMqbs"
                style={{ marginLeft: "10px", textDecoration: "none" }}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Text color="#6fcf97">Discord</Text>
              </a>
            </RowFixed>
          </AutoColumn>
        </LoggedOut>
      )}
    </Wrapper>
  )
}
