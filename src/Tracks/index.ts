import { ICON_OPTIONS } from "../components/IconManager"

// possible tracks a quest could be under
export enum TrackOption {
  COMPOUND,
}

export interface TrackDefinition {
  track: TrackOption
  name: string
  description: string
  iconOption: string
  primaryColor: string
  secondaryColor: string
}

export const ALL_TRACKS: TrackDefinition[] = [
  {
    track: TrackOption.COMPOUND,
    name: "Compound",
    description:
      "A decentralized lending and borrowing protocol and liquidity network for digital assets.",
    iconOption: ICON_OPTIONS.COMPOUND,
    primaryColor: "#C9FFE6",
    secondaryColor: "#2B5944",
  }
]
