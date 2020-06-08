import React, {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useCallback,
  useEffect,
} from "react"

const RABBIT_HOLE = "RABBIT_HOLE"

const UPDATABLE_KEYS = []
const UPDATE_KEY = "UPDATE_KEY"

const LocalStorageContext = createContext()

function useLocalStorageContext() {
  return useContext(LocalStorageContext)
}

function reducer(state, { type, payload }) {
  switch (type) {
    case UPDATE_KEY: {
      const { key, value } = payload
      if (!UPDATABLE_KEYS.some((k) => k === key)) {
        throw Error(`Unexpected key in LocalStorageContext reducer: '${key}'.`)
      } else {
        return {
          ...state,
          [key]: value,
        }
      }
    }
    default: {
      throw Error(
        `Unexpected action type in LocalStorageContext reducer: '${type}'.`
      )
    }
  }
}

function init() {
  const defaultLocalStorage = {}

  try {
    const parsed = JSON.parse(window.localStorage.getItem(RABBIT_HOLE))
    return { ...defaultLocalStorage, ...parsed }
  } catch {
    return defaultLocalStorage
  }
}

export default function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, init)

  const updateKey = useCallback((key, value) => {
    dispatch({ type: UPDATE_KEY, payload: { key, value } })
  }, [])

  return (
    <LocalStorageContext.Provider
      value={useMemo(() => [state, { updateKey }], [state, updateKey])}
    >
      {children}
    </LocalStorageContext.Provider>
  )
}

export function Updater() {
  const [state] = useLocalStorageContext()

  useEffect(() => {
    window.localStorage.setItem(RABBIT_HOLE, JSON.stringify({ ...state }))
  })

  return null
}
