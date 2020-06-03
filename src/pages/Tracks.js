import React from "react"
import { withRouter } from "react-router-dom"

import { useQuests } from "../contexts/Application"
import * as firebase from "firebase/app"
import "firebase/database"
import { useWeb3React } from "@web3-react/core"

function Tracks({ history }) {
  const { account } = useWeb3React()

  const quests = useQuests()

  function redeemPoints(quest) {
    if (quest.name && quest.progress) {
      firebase
        .database()
        .ref("users/" + account + "/quests/" + quest.name)
        .set(quest.progress)
    }
  }

  return <div></div>
}

export default withRouter(Tracks)
