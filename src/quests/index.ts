import { COMPOUND_QUESTS } from "./Compound"
import { Track } from "../constants"

// requirements for every quest
export interface QuestDefinition {
  name: string
  track: Track
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
}
