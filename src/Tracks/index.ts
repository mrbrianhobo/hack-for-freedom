import { ICON_OPTIONS } from "../components/IconManager"

// possible tracks a quest could be under
export enum TrackOption {
  COMPOUND,
  UNISWAP,
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
  },
  {
    track: TrackOption.UNISWAP,
    name: "Uniswap",
    description: "A decentralized protcol for automated liquidity.",
    iconOption: ICON_OPTIONS.UNISWAP,
    primaryColor: "#FFE1EE",
    secondaryColor: "#724E5D",
  },
]
