import React, {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useCallback,
  useEffect,
  useState,
} from "react"

import { ALL_QUESTS } from "../quests"
import { useWeb3React } from "../hooks"

import * as firebase from "firebase/app"
import "firebase/database"

const WALLET_MODAL_OPEN = "WALLET_MODAL_OPEN"
const SCORE = "SCORE"
const QUESTS = "QUESTS"

const TOGGLE_WALLET_MODAL = "TOGGLE_WALLET_MODAL"
const UPDATE_SCORE = "UPDATE_SCORE"
const UPDATE_QUESTS = "UPDATE_QUESTS"
const UPDATE_QUEST_PROGRESS = "UPDATE_QUEST_PROGRESS"
const UPDATE_QUEST_REDEEMABLE = "UPDATE_QUEST_REDEEMABLE"

const ApplicationContext = createContext()

function useApplicationContext() {
  return useContext(ApplicationContext)
}

function reducer(state, { type, payload }) {
  switch (type) {
    case UPDATE_SCORE: {
      const { score } = payload
      return {
        ...state,
        [SCORE]: score,
      }
    }
    case UPDATE_QUESTS: {
      const { quests } = payload
      return {
        ...state,
        [QUESTS]: quests,
      }
    }
    case UPDATE_QUEST_PROGRESS: {
      const { questId, progress } = payload
      return {
        ...state,
        [QUESTS]: {
          ...state?.QUESTS,
          [questId]: {
            ...state?.QUESTS?.[questId],
            progress,
          },
        },
      }
    }
    case UPDATE_QUEST_REDEEMABLE: {
      const { questId, redeemable } = payload
      return {
        ...state,
        [QUESTS]: {
          ...state?.QUESTS,
          [questId]: {
            ...state?.QUESTS?.[questId],
            redeemable,
          },
        },
      }
    }
    case TOGGLE_WALLET_MODAL: {
      return { ...state, [WALLET_MODAL_OPEN]: !state[WALLET_MODAL_OPEN] }
    }
    default: {
      throw Error(
        `Unexpected action type in ApplicationContext reducer: '${type}'.`
      )
    }
  }
}

export default function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    [WALLET_MODAL_OPEN]: false,
    [SCORE]: 0,
    [QUESTS]: [],
  })

  const toggleWalletModal = useCallback(() => {
    dispatch({ type: TOGGLE_WALLET_MODAL })
  }, [])

  const updateScore = useCallback((score) => {
    dispatch({ type: UPDATE_SCORE, payload: { score } })
  }, [])

  const updateQuestProgress = useCallback((questId, progress) => {
    dispatch({ type: UPDATE_QUEST_PROGRESS, payload: { questId, progress } })
  }, [])

  const updateQuestRedeemable = useCallback((questId, redeemable) => {
    dispatch({
      type: UPDATE_QUEST_REDEEMABLE,
      payload: { questId, redeemable },
    })
  }, [])

  return (
    <ApplicationContext.Provider
      value={useMemo(
        () => [
          state,
          {
            toggleWalletModal,
            updateScore,
            updateQuestProgress,
            updateQuestRedeemable,
          },
        ],
        [
          state,
          toggleWalletModal,
          updateScore,
          updateQuestProgress,
          updateQuestRedeemable,
        ]
      )}
    >
      {children}
    </ApplicationContext.Provider>
  )
}

/**
 *  run on load
 */
export function Updater() {
  // account info
  const { account } = useWeb3React()
  // const ENSName = useENSName(account)

  const [
    state,
    { updateQuestProgress, updateQuestRedeemable },
  ] = useApplicationContext()
  const quests = state?.[QUESTS]

  const [accountStore, setAccountStore] = useState()

  // on account change, fetch all quests from firebase and save them in context
  useEffect(() => {
    firebase
      .database()
      .ref("/users/" + account)
      .once("value")
      .then(function(snapshot) {
        setAccountStore(snapshot?.val())
      })
  }, [account])

  // loop through all quests, fetch current progress based on account, and update
  useEffect(() => {
    if (account) {
      Object.keys(ALL_QUESTS).map(async (questId) => {
        let progress = await ALL_QUESTS[questId].fetchProgress(account)
        updateQuestProgress(questId, progress)
      })
    }
  }, [account, updateQuestProgress])

  useEffect(() => {
    if (quests) {
      Object.keys(quests).map((questId) => {
        let quest = quests[questId]
        // if db doesnt know quest is done, and quest *IS* done, mark it as redeemable
        if (
          accountStore?.[ALL_QUESTS[questId].definition.name] !== quest.progress
        ) {
          // if done mark as redeemable if havent already
          if (quest.progress >= 100 && !quest.redeemable) {
            updateQuestRedeemable(questId, true)
          }
        }
        return true
      })
    }
  }, [account, accountStore, quests, updateQuestRedeemable])

  return null
}

export function useWalletModalOpen() {
  const [state] = useApplicationContext()

  return state[WALLET_MODAL_OPEN]
}

export function useWalletModalToggle() {
  const [, { toggleWalletModal }] = useApplicationContext()

  return toggleWalletModal
}

export function useScore() {
  const [state, { updateScore }] = useApplicationContext()

  const quests = state?.[QUESTS]

  useEffect(() => {
    if (quests) {
      let score = 0
      Object.keys(quests).map((questId) => {
        if (quests[questId].progress >= 100) {
          score += ALL_QUESTS[questId].definition.points
        }
        return true
      })
      updateScore(score)
    }
  }, [quests, updateScore])

  return state?.[SCORE]
}

export function useAllQuestData() {
  const [state, updateQuestRedeemable] = useApplicationContext()
  return [state?.[QUESTS], updateQuestRedeemable]
}
