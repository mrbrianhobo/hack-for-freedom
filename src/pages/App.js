import React, { Suspense } from "react"
import styled from "styled-components"
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom"

import Web3ReactManager from "../components/Web3ReactManager"
import Nav from "../components/Nav"
import AltHome from "./Home"
import TrackPage from "./Tracks"
import ProfilePage from "./Profile"
import FAQ from "../components/Faq"

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  min-height: 100vh;
  height: 100%;
  width: 100%;
`

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: flex-start;
  align-items: flex-start;
  flex: 1;
  overflow: auto;
`

export default function App() {
  return (
    <>
      <Suspense fallback={null}>
        <AppWrapper>
          <BodyWrapper>
            <Web3ReactManager>
              <BrowserRouter>
                <Nav />
                <Suspense fallback={null}>
                  <Switch>
                    <Route
                      exact
                      strict
                      path="/"
                      component={() => <AltHome />}
                    />
                    <Route
                      exact
                      strict
                      path="/profile"
                      component={() => <ProfilePage />}
                    />
                    <Route
                      exact
                      strict
                      path="/tracks"
                      component={() => <TrackPage />}
                    />
                    <Route exact string path="/faq" component={() => <FAQ />} />
                    <Redirect to="/" />
                  </Switch>
                </Suspense>
              </BrowserRouter>
            </Web3ReactManager>
          </BodyWrapper>
        </AppWrapper>
      </Suspense>
    </>
  )
}
