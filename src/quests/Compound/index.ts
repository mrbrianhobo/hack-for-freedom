import { ICON_OPTIONS } from "./../../components/IconManager/index"
import { compoundClient } from "../../apollo/client"
import { COMPOUND_QUERY } from "../../apollo/queries"
import { QuestObject } from ".."
import { TrackOption } from "../../Tracks"

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

export const fetchComp102 = async function(account: string): Promise<number> {
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
    //COMP102
      // If the user has ever borrowed at all
      if (result.data.account.hasBorrowed === true) {
        progress = 100
      }
    }
  } catch {
    console.log("ERROR: progress fetch COMP102")
  }
  return progress
}


export const COMPOUND_CATEGORIES: [{ name: string; quests: string[] }] = [
  {
    name: "Lending & Borrowing",
    quests: ["COMP101", "COMP102"],
  }
]

export const COMPOUND_QUESTS: { [questKey: string]: QuestObject } = {
  COMP1: {
    // this is the global definition of the quest
    definition: {
      id: "COMP101",
      name: "COMP-101",
      track: TrackOption.COMPOUND,
      blurb: "Supply Any Asset on compound",
      description:
        "The Compound Protocol is a series of interest rate markets running on the Ethereum blockchain. When users and applications supply an asset to the Compound protocol, they begin earning a variable interest income instantly. Interest accrues every Ethereum block (~15 seconds), and users can withdraw their principal plus interest anytime. Under the hood, users are contributing their assets to a large pool of liquidity (a “market”) that is available for other users to borrow, and they share in the interest that borrowers pay back to the pool. When users supply assets, they receive cTokens from Compound in exchange. cTokens are ERC20 tokens that can be redeemed for their underlying assets at any time. ",
      link: "",
      color: "",
      iconOption: ICON_OPTIONS.PIGGY,
      points: 100,
    },
    fetchProgress: fetchComp101,
  },
  COMP2: {
    // this is the global definition of the quest
    definition: {
      id: "COMP102",
      name: "COMP-102",
      track: TrackOption.COMPOUND,
      blurb: "Borrow Any Asset on compound",
      description:
        "The Compound Protocol is a series of interest rate markets running on the Ethereum blockchain. When users and applications supply an asset to the Compound protocol, they begin earning a variable interest income instantly. Interest accrues every Ethereum block (~15 seconds), and users can withdraw their principal plus interest anytime. Under the hood, users are contributing their assets to a large pool of liquidity (a “market”) that is available for other users to borrow, and they share in the interest that borrowers pay back to the pool. When users supply assets, they receive cTokens from Compound in exchange. cTokens are ERC20 tokens that can be redeemed for their underlying assets at any time. ",
      link: "",
      color: "",
      iconOption: ICON_OPTIONS.PIGGY,
      points: 100,
    },
    fetchProgress: fetchComp102,
  }
}
