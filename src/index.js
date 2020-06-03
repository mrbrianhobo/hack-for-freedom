import React from "react"
import ReactDOM from "react-dom"
import { Web3ReactProvider, createWeb3ReactRoot } from "@web3-react/core"
import { ethers } from "ethers"

import LocalStorageContextProvider, {
  Updater as LocalStorageContextUpdater,
} from "./contexts/LocalStorage"
import ApplicationContextProvider, {
  Updater as ApplicationContextUpdater,
} from "./contexts/Application"
import App from "./pages/App"
import ThemeProvider, { GlobalStyle } from "./theme"
import "./i18n"
import * as firebase from "firebase/app"
import "firebase/database"

const Web3ProviderNetwork = createWeb3ReactRoot("NETWORK")

function getLibrary(provider) {
  const library = new ethers.providers.Web3Provider(provider)
  library.pollingInterval = 10000
  return library
}

const firebaseConfig = {
  apiKey: "AIzaSyDll6l4BLA5igdSSaAiTofQufyoCI15oaQ",
  authDomain: "rabbithole-de9b3.firebaseapp.com",
  databaseURL: "https://rabbithole-de9b3.firebaseio.com",
  projectId: "rabbithole-de9b3",
  storageBucket: "rabbithole-de9b3.appspot.com",
  messagingSenderId: "415030966156",
  appId: "1:415030966156:web:b5f196c2bf0c0f49d0c8a9",
  measurementId: "G-G09XBG9LPV",
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

function ContextProviders({ children }) {
  return (
    <LocalStorageContextProvider>
      <ApplicationContextProvider>{children}</ApplicationContextProvider>
    </LocalStorageContextProvider>
  )
}

function Updaters() {
  return (
    <>
      <LocalStorageContextUpdater />
      <ApplicationContextUpdater />
    </>
  )
}

ReactDOM.render(
  <Web3ReactProvider getLibrary={getLibrary}>
    <Web3ProviderNetwork getLibrary={getLibrary}>
      <ContextProviders>
        <Updaters />
        <ThemeProvider>
          <>
            <GlobalStyle />
            <App />
          </>
        </ThemeProvider>
      </ContextProviders>
    </Web3ProviderNetwork>
  </Web3ReactProvider>,
  document.getElementById("root")
)
