import { COMPOUND_CATEGORIES } from "./Compound/index"
import { COMPOUND_QUESTS } from "./Compound"
import { TrackOption } from "../Tracks"

// requirements for every quest
export interface QuestDefinition {
  id: string
  name: string
  track: TrackOption
  blurb: string
  description: string
  link: string
  color: string
  iconOption: string
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
}

export function getQuestsFromTrack(track: TrackOption) {
  switch (track) {
    case TrackOption.COMPOUND:
      return COMPOUND_QUESTS
    default:
      return COMPOUND_QUESTS
  }
}

export function getCategoriesFromTrack(
  track: TrackOption
): [{ name: string; quests: string[] }] {
  switch (track) {
    case TrackOption.COMPOUND:
      return COMPOUND_CATEGORIES
    default:
      return COMPOUND_CATEGORIES
  }
}

export function getTotalXpFromTrack(track: TrackOption): number {
  let quests = getQuestsFromTrack(track)
  let total = 0
  Object.keys(quests).map((questId) => {
    return (total = total + quests[questId].definition.points)
  })
  return total
}
