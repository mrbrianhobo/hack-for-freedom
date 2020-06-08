import { COMPOUND_QUESTS } from "./Compound"
import { TrackOption } from "../Tracks"
import { UNISWAP_QUESTS } from "./Uniswap"

// requirements for every quest
export interface QuestDefinition {
  name: string
  track: TrackOption
  description: string
  link: string
  color: string
  imageName: string
  points: number
}

// enforce a base definition and fetching script for progress
export interface QuestObject {
  definition: QuestDefinition
  fetchProgress(account: string): Promise<number>
}

// combine all quests defined in sub folders
export const ALL_QUESTS: { [questKey: string]: QuestObject } = {
  ...COMPOUND_QUESTS,
  ...UNISWAP_QUESTS,
}

export function getQuestsFromTrack(track: TrackOption) {
  switch (track) {
    case TrackOption.COMPOUND:
      return COMPOUND_QUESTS
    case TrackOption.UNISWAP:
      return UNISWAP_QUESTS
    default:
      return COMPOUND_QUESTS
  }
}
