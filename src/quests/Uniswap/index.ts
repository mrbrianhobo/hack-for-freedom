import { QuestObject } from ".."
import { TrackOption } from "../../Tracks"
import { uniClient } from "../../apollo/client"
import { UNI_POOL_QUERY } from "../../apollo/queries"

export const fetchUni101 = async function(account: string): Promise<number> {
  let progress: number = 0
  try {
    let result = await uniClient.query({
      query: UNI_POOL_QUERY,
      fetchPolicy: "cache-first",
      variables: {
        user: account,
      },
    })
    if (result.data.userExchangeDatas) {
      let supplied = false
      Object.keys(result.data.userExchangeDatas).map((key) => {
        let exchange = result.data.userExchangeDatas[key]
        if (exchange.tokensDeposited > 0) {
          supplied = true
        }
        return true
      })
      if (supplied) {
        progress = 100
      }
    }
  } catch {
    console.log("ERROR: progress fetch UNI-101")
  }
  return progress
}

export const UNISWAP_QUESTS: { [questKey: string]: QuestObject } = {
  UNI1: {
    // this is the global definition of the quest
    definition: {
      id: "UNI1",
      name: "UNI-101",
      track: TrackOption.UNISWAP,
      blurb: "Swap on Uniswap",
      description: "Make a token swap on Uniswap V1",
      link: "",
      color: "",
      iconOption: "",
      points: 100,
      tier: 1,
    },
    fetchProgress: fetchUni101,
  },
}
