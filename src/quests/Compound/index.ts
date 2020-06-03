import { compoundClient } from "../../apollo/client"
import { COMPOUND_QUERY } from "../../apollo/queries"
import { QuestObject } from ".."
import { Track } from "../../constants"

export const fetchComp101 = async function(account: string): Promise<number> {
  let progress: number = 0
  try {
    let result = await compoundClient.query({
      query: COMPOUND_QUERY,
      fetchPolicy: "cache-first",
      variables: {
        user: account.toLowerCase(),
      },
    })
    if (result.data.account) {
      if (parseFloat(result.data.account.totalCollateralValueInEth) > 0) {
        progress = 100
      }
    }
  } catch {
    console.log("ERROR: progress fetch COMP101")
  }
  return progress
}

export const COMPOUND_QUESTS: { [questKey: string]: QuestObject } = {
  COMP1: {
    // this is the global definition of the quest
    definition: {
      name: "COMP-101",
      track: Track.COMPOUND,
      description: "",
      link: "",
      color: "",
      imageName: "",
      points: 100,
    },
    fetchProgress: fetchComp101,
  },
}
