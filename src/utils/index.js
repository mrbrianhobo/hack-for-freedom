import { ethers } from "ethers"
import { formatFixed } from "@uniswap/sdk"
import Confetti from "canvas-confetti"

export function triggerConfetti() {
  Confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  })
}

const ETHERSCAN_PREFIXES = {
  1: "",
  3: "ropsten.",
  4: "rinkeby.",
  5: "goerli.",
  42: "kovan.",
}

export function getEtherscanLink(networkId, data, type) {
  const prefix = `https://${ETHERSCAN_PREFIXES[networkId] ||
    ETHERSCAN_PREFIXES[1]}etherscan.io`

  switch (type) {
    case "transaction": {
      return `${prefix}/tx/${data}`
    }
    case "address":
    default: {
      return `${prefix}/address/${data}`
    }
  }
}

export function shortenAddress(address, digits = 4) {
  if (!isAddress(address)) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return `${address.substring(0, digits + 2)}...${address.substring(
    42 - digits
  )}`
}

export function shortenTransactionHash(hash, digits = 4) {
  return `${hash.substring(0, digits + 2)}...${hash.substring(66 - digits)}`
}

export function isAddress(value) {
  try {
    return ethers.utils.getAddress(value.toLowerCase())
  } catch {
    return false
  }
}

export function formatToUsd(price) {
  const format = { decimalSeparator: ".", groupSeparator: ",", groupSize: 3 }
  const usdPrice = formatFixed(price, {
    decimalPlaces: 2,
    dropTrailingZeros: false,
    format,
  })
  return usdPrice
}

// amount must be a BigNumber, {base,display}Decimals must be Numbers
export function amountFormatter(
  amount,
  baseDecimals = 18,
  displayDecimals = 3,
  useLessThan = true
) {
  if (
    baseDecimals > 18 ||
    displayDecimals > 18 ||
    displayDecimals > baseDecimals
  ) {
    throw Error(
      `Invalid combination of baseDecimals '${baseDecimals}' and displayDecimals '${displayDecimals}.`
    )
  }

  // if balance is falsy, return undefined
  if (!amount) {
    return undefined
  }
  // if amount is 0, return
  else if (amount.isZero()) {
    return "0"
  }
  // amount > 0
  else {
    // amount of 'wei' in 1 'ether'
    const baseAmount = ethers.utils
      .bigNumberify(10)
      .pow(ethers.utils.bigNumberify(baseDecimals))

    const minimumDisplayAmount = baseAmount.div(
      ethers.utils
        .bigNumberify(10)
        .pow(ethers.utils.bigNumberify(displayDecimals))
    )

    // if balance is less than the minimum display amount
    if (amount.lt(minimumDisplayAmount)) {
      return useLessThan
        ? `<${ethers.utils.formatUnits(minimumDisplayAmount, baseDecimals)}`
        : `${ethers.utils.formatUnits(amount, baseDecimals)}`
    }
    // if the balance is greater than the minimum display amount
    else {
      const stringAmount = ethers.utils.formatUnits(amount, baseDecimals)

      // if there isn't a decimal portion
      if (!stringAmount.match(/\./)) {
        return stringAmount
      }
      // if there is a decimal portion
      else {
        const [wholeComponent, decimalComponent] = stringAmount.split(".")
        const roundedDecimalComponent = ethers.utils
          .bigNumberify(decimalComponent.padEnd(baseDecimals, "0"))
          .toString()
          .padStart(baseDecimals, "0")
          .substring(0, displayDecimals)

        // decimals are too small to show
        if (roundedDecimalComponent === "0".repeat(displayDecimals)) {
          return wholeComponent
        }
        // decimals are not too small to show
        else {
          return `${wholeComponent}.${roundedDecimalComponent
            .toString()
            .replace(/0*$/, "")}`
        }
      }
    }
  }
}
