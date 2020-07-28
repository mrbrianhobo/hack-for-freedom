import { injected, walletconnect, walletlink, fortmatic } from "../connectors"

export const SUPPORTED_WALLETS = {
  INJECTED: {
    connector: injected,
    id: "Injected",
    name: "Injected",
    iconName: "arrow-right.svg",
    description: "Injected web3 provider.",
    color: "#010101",
  },
  WALLET_CONNECT: {
    connector: walletconnect,
    id: "WalletConnect",
    name: "Wallet Connect",
    iconName: "walletConnectIcon.svg",
    description: "Connect to Trust Wallet, Rainbow Wallet and more...",
    color: "#4196FC",
  },
  WALLET_LINK: {
    connector: walletlink,
    id: "WalletLink",
    name: "Coinbase Wallet",
    iconName: "coinbaseWalletIcon.svg",
    description: "Use Coinbase Wallet app on mobile device",
    color: "#315CF5",
  },
  FORTMATIC: {
    connector: fortmatic,
    id: "Fortmatic",
    name: "Fortmatic",
    iconName: "fortmaticIcon.png",
    description: "Login using Fortmatic hosted wallet",
    color: "#6748FF",
  },
}

export const MOBILE_DEEP_LINKS = {
  COINBASE_LINK: {
    name: "Open in Coinbase Wallet",
    iconName: "coinbaseWalletIcon.svg",
    description: "Open in Coinbase Wallet app.",
    href: "https://go.cb-w.com/mtUDhEZPy1",
    color: "#315CF5",
  },
  TRUST_WALLET_LINK: {
    name: "Open in Trust Wallet",
    iconName: "trustWallet.png",
    description: "iOS and Android app.",
    href:
      "https://link.trustwallet.com/open_url?coin_id=60&url=https://rabbithole.gg",
    color: "#1C74CC",
  },
}

export const LEVELS = {
  1: 0,
  2: 100,
  3: 300,
  4: 750,
  5: 1500,
  6: 3000,
  7: 5000,
  8: 7500,
  9: 10000,
}

export const MAX_LEVEL = 9

export const NetworkContextName = "NETWORK"
