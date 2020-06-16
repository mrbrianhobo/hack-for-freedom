import React, { useState } from "react"
import styled from "styled-components"
import { useWeb3React } from "@web3-react/core"
import Web3Status from "../Web3Status"
import useMedia from "use-media"
import { useScore } from "../../contexts/Application"
import { LEVELS, MAX_LEVEL } from "../../constants"
import { withRouter } from "react-router-dom"
import { Text } from "rebass"
import { Hover } from "../../theme/components"

const NavWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 60px;
  align-items: center;

  @media (max-width: 970px) {
    justify-content: space-between;
  }
`

const BrandWrapper = styled.div`
  display: flex;
  width: 30%;
  justify-content: flex-start;
  align-items: center;
  padding-left: 40px;
  font-size: 45px;

  @media (max-width: 580px) {
    padding-left: 16px;
  }
`

const Logo = styled.img`
  display: flex;
  width: 150px;
`

const NavList = styled.div`
  display: flex;
  width: 40%;
  padding: 0;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const NavItem = styled.div`
  font-weight: bold;
  padding: 15px 25px;
  font-size: 16px;
  text-decoration: none;
  margin-right: 5px;
  color: ${({ active }) => (active ? "#EFEFEF" : "#A1A4B1")};
  background: ${({ active }) =>
    active
      ? "linear-gradient(180deg, rgba(141, 251, 201, 0) 0%, rgba(141, 251, 201, 0.1) 100%)"
      : "none"};

  border-bottom: ${({ active }) =>
    active ? "1px solid #8DFBC9" : "1px solid transparent"};

  :hover {
    cursor: pointer;
    border-bottom: 1px solid #8dfbc9;
  }
`

const AccountWrapper = styled.div`
  display: flex;
  padding-right: 40px;
  width: 30%;
  align-items: center;
  justify-content: flex-end;

  @media (max-width: 580px) {
    width: 100%;
    justify-content: flex-end;
    padding-right: 20px;
  }
`

const LoginWrapper = styled.div`
  max-width: 200px;
  height: 35px;

  @media (max-width: 970px) {
    margin-right: 10px;
    display: ${({ account }) => (account === undefined ? "block" : "none")};
  }
`

const LevelDiv = ({ className, score }) => {
  const level = getLevelFromScore(score);
  const currentXP = level < MAX_LEVEL ? score - LEVELS[level] : score;
  const XPtoNextLevel = level < MAX_LEVEL ? LEVELS[level + 1] - LEVELS[level] : 0;
  return (
    <div className={className}>
      <LevelInfo level={level} />
      <ProgressBar xp={currentXP} xpNext={XPtoNextLevel} />
      <ProgressXP xp={currentXP} xpNext={XPtoNextLevel} />
    </div>
  )
}

const Level = styled(LevelDiv)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: Inter;
  padding: 16px;

  @media (max-width: 970px) {
    display: none;
  }
`

const LevelInfoDiv = ({ className, level }) => {
  return <div className={className}>Level {level}</div>
}

const LevelInfo = styled(LevelInfoDiv)`
  font-family: Inter;
  font-style: normal;
  font-weight: bold;
  font-size: 13px;
  line-height: 24px;
  letter-spacing: 2px;
`

const FilledBar = styled.div`
  position: absolute;
  height: 10px;
  background: #8DFBC9;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 50px;
  margin: 0.5px;
`

const XPBar = styled.div`
  position: relative;
  width: 150px;
  height: 10px;
  background: #242424;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 50px;
  margin: 0.5px;
`

const ProgressBar = ({ xp, xpNext }) => {
  // xp / relative level xp * 150 (width of xp bar)
  const fillWidth = xpNext > 0 ? xp / xpNext * 150 : 150;
  return (
    <XPBar>
      <FilledBar style={{width: fillWidth }} />
    </XPBar>
  )
}

const ProgressXPDiv = ({ className, xp, xpNext }) => {
  return (
    xpNext > 0 
      ? <div className={className}>{xp}/{xpNext} XP</div>
      : <div className={className}>{xp} XP</div>
  )
}

const ProgressXP = styled(ProgressXPDiv)`
  font-family: Inter;
  font-style: normal;
  font-weight: bold;
  font-size: 10px;
  line-height: 24px;
  letter-spacing: 2px;
  color: #8DFBC9;
  opacity: 0.5;
`

const Sidebar = styled.div`
  display: none;

  @media (max-width: 970px) {
    display: ${({ sidebarOpen }) => (sidebarOpen ? "flex" : "none")};
    width: 75%;
    height: 100%;
    background: #050b14;
    position: absolute;
    z-index: 2;
    flex-direction: column;
  }
`

const SidebarBrandWrapper = styled.div`
  margin 15px auto;
`

const SidebarList = styled.div`
  display: flex;
  margin-top: 15px;
  height: 40%;
  padding: 0;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`

const SidebarItem = styled.div`
  font-weight: bold;
  padding: 15px 0;
  width: 60%;
  font-size: 16px;
  text-decoration: none;
  text-align: center;
  color: ${({ active }) => (active ? "#EFEFEF" : "#A1A4B1")};
  background: ${({ active }) =>
    active
      ? "linear-gradient(180deg, rgba(141, 251, 201, 0) 0%, rgba(141, 251, 201, 0.1) 100%)"
      : "none"};

  border-bottom: ${({ active }) =>
    active ? "1px solid #8DFBC9" : "1px solid transparent"};

  :hover {
    cursor: pointer;
    border-bottom: 1px solid #8dfbc9;
  }
`

const SidebarLevel = styled(Level)`
  padding: 0px;

  @media (max-width: 970px) {
    display: flex;
  }
`

const SidebarLoginWrapper = styled.div`
  max-width: 200px;
  height: 35px;
  margin: 10px auto;
`

const CloseIcon = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
`

const getLevelFromScore = (score) => {
  let currentLvl = 1;
  const levels = Object.keys(LEVELS);
  for (const level of levels) {
    if (score >= LEVELS[level]) {
      currentLvl = level
    }
  }
  return parseInt(currentLvl);
}

function Nav({ history }) {
  const [sidebarOpen, toggleSidebarOpen] = useState(false)

  const isExtraSmall = useMedia({ maxWidth: "970px" })

  const score = useScore()

  const { account } = useWeb3React()

  function toggleSidebar(sidebarOpen) {
    toggleSidebarOpen(sidebarOpen === true ? false : true)
  }

  return (
    <>
      <NavWrapper>
        {account && (
          <BrandWrapper>
            <a href="/">
              <Logo
                src={require("../../assets/images/rabbithole.png")}
                alt="rabbithole logo"
              />
            </a>
          </BrandWrapper>
        )}
        {!isExtraSmall && account && (
          <NavList>
            <NavItem
              onClick={() => history.push("/")}
              active={history.location.pathname === "/"}
            >
              Explore
            </NavItem>
            <NavItem
              onClick={() => history.push("/tracks")}
              active={history.location.pathname === "/tracks"}
            >
              Tracks
            </NavItem>
            <NavItem
              onClick={() => history.push("/profile")}
              active={history.location.pathname === "/profile"}
            >
              Profile
            </NavItem>
            <NavItem
              onClick={() => history.push("/faq")}
              active={history.location.pathname === "/faq"}
            >
              FAQ
            </NavItem>
          </NavList>
        )}

        <AccountWrapper>
          {!isExtraSmall && account && (
            <LoginWrapper>
              <Web3Status />
            </LoginWrapper>
          )}
          {account && <Level score={score} />}
          {isExtraSmall && (
            <Hover
              onClick={() => {
                toggleSidebar(sidebarOpen)
              }}
            >
              <Text color="#8DFBC9" fontWeight={500}>
                Menu
              </Text>
            </Hover>
          )}
        </AccountWrapper>
      </NavWrapper>
      <Sidebar sidebarOpen={sidebarOpen}>
        <CloseIcon onClick={() => toggleSidebarOpen(false)}>X</CloseIcon>
        <SidebarBrandWrapper>
          <a href="/">
            <Logo
              src={require("../../assets/images/rabbithole.png")}
              alt="rabbithole logo"
            />
          </a>
        </SidebarBrandWrapper>
        {account && <SidebarLevel score={score} />}
        <SidebarList>
          <SidebarItem
            onClick={() => {
              history.push("/")
              toggleSidebar(sidebarOpen)
            }}
            active={history.location.pathname === "/"}
          >
            Explore
          </SidebarItem>
          <SidebarItem
            onClick={() => {
              history.push("/tracks")
              toggleSidebar(sidebarOpen)
            }}
            active={history.location.pathname === "/tracks"}
          >
            Tracks
          </SidebarItem>
          <SidebarItem
            onClick={() => {
              history.push("/profile")
              toggleSidebar(sidebarOpen)
            }}
            active={history.location.pathname === "/profile"}
          >
            Profile
          </SidebarItem>
          <SidebarItem
            onClick={() => {
              history.push("/faq")
              toggleSidebar(sidebarOpen)
            }}
            active={history.location.pathname === "/faq"}
          >
            FAQ
          </SidebarItem>
        </SidebarList>
        <SidebarLoginWrapper>
          <Web3Status />
        </SidebarLoginWrapper>
      </Sidebar>
    </>
  )
}

export default withRouter(Nav)
