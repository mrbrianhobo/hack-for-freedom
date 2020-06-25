import React, {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useCallback,
  useEffect,
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
const UPDATE_DB_DATA = "UPDATE_DB_DATA"
const UPDATE_QUEST_PROGRESS = "UPDATE_QUEST_PROGRESS"
const UPDATE_QUEST_REDEEMABLE = "UPDATE_QUEST_REDEEMABLE"

const ApplicationContext = createContext()

function useApplicationContext() {
  return useContext(ApplicationContext)
}

function reducer(state, { type, payload }) {
  switch (type) {
    case UPDATE_SCORE: {
      const { account, score } = payload
      return {
        ...state,
        [account]: {
          ...state?.[account],
          [SCORE]: score,
        },
      }
    }
    case UPDATE_DB_DATA: {
      const { account, accountStore } = payload
      return {
        ...state,
        [account]: {
          ...state?.[account],
          accountStore,
        },
      }
    }

    case UPDATE_QUEST_PROGRESS: {
      const { account, questId, progress } = payload
      return {
        ...state,

        [account]: {
          ...state?.[account],
          [QUESTS]: {
            ...state?.[account]?.QUESTS,
            [questId]: {
              ...state?.[account]?.QUESTS?.[questId],
              progress,
            },
          },
        },
      }
    }

    case UPDATE_QUEST_REDEEMABLE: {
      const { account, questId, redeemable } = payload
      return {
        ...state,
        [account]: {
          ...state?.[account],
          [QUESTS]: {
            ...state?.[account]?.QUESTS,
            [questId]: {
              ...state?.[account]?.QUESTS?.[questId],
              redeemable,
            },
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
  })

  const toggleWalletModal = useCallback(() => {
    dispatch({ type: TOGGLE_WALLET_MODAL })
  }, [])

  const updateScore = useCallback((account, score) => {
    dispatch({ type: UPDATE_SCORE, payload: { account, score } })
  }, [])

  const updateAccountStore = useCallback((account, accountStore) => {
    dispatch({ type: UPDATE_DB_DATA, payload: { account, accountStore } })
  }, [])

  const updateQuestProgress = useCallback((account, questId, progress) => {
    dispatch({
      type: UPDATE_QUEST_PROGRESS,
      payload: { account, questId, progress },
    })
  }, [])

  const updateQuestRedeemable = useCallback((account, questId, redeemable) => {
    dispatch({
      type: UPDATE_QUEST_REDEEMABLE,
      payload: { account, questId, redeemable },
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
            updateAccountStore,
          },
        ],
        [
          state,
          toggleWalletModal,
          updateScore,
          updateQuestProgress,
          updateQuestRedeemable,
          updateAccountStore,
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

  const [
    state,
    { updateQuestProgress, updateQuestRedeemable, updateAccountStore },
  ] = useApplicationContext()
  const quests = state?.[account]?.[QUESTS]

  const accountStore = state?.[account]?.accountStore

  const userDBData = account && accountStore?.[account]

  const userScore = state?.[account]?.[SCORE]

  // on account change, fetch all quests from firebase and save them in context
  useEffect(() => {
    account &&
      firebase
        .database()
        .ref("/users/")
        .once("value")
        .then(function(snapshot) {
          updateAccountStore(account, snapshot?.val())
        })
  }, [account, updateAccountStore])

  // loop through all quests, fetch current progress based on account, and update
  useEffect(() => {
    if (account) {
      Object.keys(ALL_QUESTS).map(async (questId) => {
        let progress = await ALL_QUESTS[questId].fetchProgress(account)
        updateQuestProgress(account, questId, progress)
      })
    }
  }, [account, updateQuestProgress, updateQuestRedeemable])

  // check for which quests are redeemable
  useEffect(() => {
    if (account && quests && accountStore) {
      Object.keys(quests).map((questId) => {
        let quest = quests[questId]
        if (
          quest.progress >= 100 &&
          quest.redeemable === undefined &&
          (!userDBData ||
            userDBData?.quests?.[ALL_QUESTS[questId].definition.id] !==
              quest.progress)
        ) {
          updateQuestRedeemable(account, questId, true)
        }
        return true
      })
    }
  }, [account, accountStore, quests, updateQuestRedeemable, userDBData])

  useEffect(() => {
    if (userScore && account) {
      firebase
        .database()
        .ref("users/" + account + "/totalXP/")
        .set(userScore)
    }
    if (account && !userScore) {
      firebase
        .database()
        .ref("users/" + account + "/totalXP/")
        .set(0)
    }
  }, [account, userScore])

  return null
}

export function useScore() {
  const [state, { updateScore }] = useApplicationContext()

  const { account } = useWeb3React()

  const quests = state?.[account]?.[QUESTS]

  const accountStore = state?.[account]?.accountStore

  useEffect(() => {
    if (quests && accountStore && account) {
      let score = 0
      Object.keys(quests).map((questId) => {
        if (quests[questId].progress >= 100 && !quests[questId].redeemable) {
          score += ALL_QUESTS[questId].definition.points
        }
        return true
      })
      updateScore(account, score)
    }
  }, [quests, account, updateScore, accountStore])

  return state?.[account]?.[SCORE]
}

export function useAllQuestData() {
  const { account } = useWeb3React()
  const [state, { updateQuestRedeemable }] = useApplicationContext()
  return [state?.[account]?.[QUESTS], updateQuestRedeemable]
}

export function useUserDbData() {
  const { account } = useWeb3React()
  const [state] = useApplicationContext()
  const dbData = state?.[account]?.accountStore
  return dbData
}

export function useWalletModalOpen() {
  const [state] = useApplicationContext()

  return state[WALLET_MODAL_OPEN]
}

export function useWalletModalToggle() {
  const [, { toggleWalletModal }] = useApplicationContext()

  return toggleWalletModal
}
