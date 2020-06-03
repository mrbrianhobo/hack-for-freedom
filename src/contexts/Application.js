import React, {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useCallback,
  useEffect,
  useState,
} from "react"

import { fetchQuests } from "../quests"
import { useWeb3React, useENSName } from "../hooks"
import { safeAccess } from "../utils"
import { getUSDPrice } from "../utils/price"

import * as firebase from "firebase/app"
import "firebase/database"

const BLOCK_NUMBER = "BLOCK_NUMBER"
const USD_PRICE = "USD_PRICE"
const WALLET_MODAL_OPEN = "WALLET_MODAL_OPEN"
const SCORE = "SCORE"
const QUESTS = "QUESTS"

const UPDATE_BLOCK_NUMBER = "UPDATE_BLOCK_NUMBER"
const UPDATE_USD_PRICE = "UPDATE_USD_PRICE"
const TOGGLE_WALLET_MODAL = "TOGGLE_WALLET_MODAL"
const UPDATE_SCORE = "UPDATE_SCORE"
const UPDATE_QUESTS = "UPDATE_QUESTS"

const ApplicationContext = createContext()

function useApplicationContext() {
  return useContext(ApplicationContext)
}

function reducer(state, { type, payload }) {
  switch (type) {
    case UPDATE_BLOCK_NUMBER: {
      const { networkId, blockNumber } = payload
      return {
        ...state,
        [BLOCK_NUMBER]: {
          ...(safeAccess(state, [BLOCK_NUMBER]) || {}),
          [networkId]: blockNumber,
        },
      }
    }
    case UPDATE_USD_PRICE: {
      const { networkId, USDPrice } = payload
      return {
        ...state,
        [USD_PRICE]: {
          ...(safeAccess(state, [USD_PRICE]) || {}),
          [networkId]: USDPrice,
        },
      }
    }
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
    [BLOCK_NUMBER]: {},
    [USD_PRICE]: {},
    [WALLET_MODAL_OPEN]: false,
    [SCORE]: 0,
    [QUESTS]: [],
  })

  const updateBlockNumber = useCallback((networkId, blockNumber) => {
    dispatch({ type: UPDATE_BLOCK_NUMBER, payload: { networkId, blockNumber } })
  }, [])

  const updateUSDPrice = useCallback((networkId, USDPrice) => {
    dispatch({ type: UPDATE_USD_PRICE, payload: { networkId, USDPrice } })
  }, [])

  const toggleWalletModal = useCallback(() => {
    dispatch({ type: TOGGLE_WALLET_MODAL })
  }, [])

  const updateScore = useCallback((score) => {
    dispatch({ type: UPDATE_SCORE, payload: { score } })
  }, [])

  const updateQuests = useCallback((quests) => {
    dispatch({ type: UPDATE_QUESTS, payload: { quests } })
  }, [])

  return (
    <ApplicationContext.Provider
      value={useMemo(
        () => [
          state,
          {
            updateBlockNumber,
            updateUSDPrice,
            toggleWalletModal,
            updateScore,
            updateQuests,
          },
        ],
        [
          state,
          updateBlockNumber,
          updateUSDPrice,
          toggleWalletModal,
          updateScore,
          updateQuests,
        ]
      )}
    >
      {children}
    </ApplicationContext.Provider>
  )
}

export function Updater() {
  const { library, chainId, account } = useWeb3React()

  const ENSName = useENSName(account)

  const [
    state,
    { updateBlockNumber, updateUSDPrice, updateQuests },
  ] = useApplicationContext()

  // quests
  const quests = state?.[QUESTS]

  // the reference to the users status from db
  const [accountStore, setAccountStore] = useState()

  // update usd price
  useEffect(() => {
    if (library && chainId === 1) {
      let stale = false

      getUSDPrice(library)
        .then(([price]) => {
          if (!stale) {
            updateUSDPrice(chainId, price)
          }
        })
        .catch(() => {
          if (!stale) {
            updateUSDPrice(chainId, null)
          }
        })
    }
  }, [library, chainId, updateUSDPrice])

  // update block number
  useEffect(() => {
    if (library) {
      let stale = false

      function update() {
        library
          .getBlockNumber()
          .then((blockNumber) => {
            if (!stale) {
              updateBlockNumber(chainId, blockNumber)
            }
          })
          .catch(() => {
            if (!stale) {
              updateBlockNumber(chainId, null)
            }
          })
      }

      update()
      library.on("block", update)

      return () => {
        stale = true
        library.removeListener("block", update)
      }
    }
  }, [chainId, library, updateBlockNumber])

  useEffect(() => {
    fetchQuests(ENSName, account).then((data) => {
      if (data) {
        updateQuests(data)
      }
    })
  }, [ENSName, account, updateQuests])

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

  useEffect(() => {
    if (quests) {
      quests.map((quest, index) => {
        // if no stored value, add it if not done,  make it redeemable if done
        if (accountStore?.quests[quest.name] !== quest.progress) {
          // update the database with current score

          // if done mark as redeemable
          if (quest.progress >= 100) {
            let newQuests = quests
            newQuests[index].redeemable = true
            updateQuests(newQuests) // update the global quest object with new redemption status
          }
        }
        return true
      })
    }
  }, [account, accountStore, quests, updateQuests])

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
      quests.map((quest) => {
        if (quest.progress >= 100) {
          score += quest.points
        }
        return true
      })
      updateScore(score)
    }
  }, [quests, updateScore])

  return state?.[SCORE]
}

export function useQuests() {
  const [state] = useApplicationContext()

  return state?.[QUESTS]
}
