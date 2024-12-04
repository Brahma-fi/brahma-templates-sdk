import {
  parseUnits as parseUnitsViem,
  formatUnits as formatUnitsViem,
} from "viem";
import { v4, V4Options } from "uuid";

import { TAsset } from "../types";
import { USER_REJECTED_REQUEST_CODE } from "@/constants";

export const formatUnits = (value: string | bigint, unitName = 18): string => {
  try {
    if (!value) return "0";
    if (typeof value === "bigint") return formatUnitsViem(value, unitName);
    return formatUnitsViem(BigInt(value), unitName);
  } catch (err) {
    console.error("[ERROR ON FORMAT UNITS]:", err);
    return "0";
  }
};

export const parseUnits = (value: string, unitName = 18): bigint => {
  return parseUnitsViem(value, unitName);
};

export const truncateString = (str: string, start = 6, end = 4) => {
  if (!str) return "";
  if (str.length <= start + end) {
    return str;
  }
  const truncated = `${str.substring(0, start)}...${str.substring(
    str.length - end
  )}`;
  return truncated;
};

export const formatNumberWithCommas = (
  _input: string | number
): string | number => {
  if (!_input) return _input;

  const result = _input
    .toString()
    .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  return result;
};

export const sliceDecimalString = (
  input: string,
  decimals = 6,
  addThousandsFormatting = false
): string => {
  if (!input) return "0";
  const parts = input.split(".");

  if (parts.length === 1) {
    // Input string does not contain a decimal point
    return input;
  }

  const integerPart = parts[0];

  let decimalPart = parts[1];

  decimalPart = decimalPart.slice(0, decimals);

  while (decimalPart.endsWith("0")) {
    // Remove trailing zeros
    decimalPart = decimalPart.slice(0, -1);
  }

  if (decimalPart.length === 0) {
    return addThousandsFormatting
      ? (formatNumberWithCommas(integerPart) as string)
      : integerPart;
  }

  const result = `${integerPart}.${decimalPart}`;

  if (addThousandsFormatting) {
    return formatNumberWithCommas(result) as string;
  }

  return result;
};

// This was defined by product team, order: verified, balanceOf, alphabetical
export function sortAssets(assets: TAsset[]): TAsset[] {
  return assets.sort((a, b) => {
    if (a.verified && !b.verified) {
      return -1;
    } else if (!a.verified && b.verified) {
      return 1;
    } else if (a.balanceOf && b.balanceOf) {
      const balanceA = parseFloat(a.balanceOf.formatted);
      const balanceB = parseFloat(b.balanceOf.formatted);
      return balanceB - balanceA;
    } else if (a.balanceOf && !b.balanceOf) {
      return -1;
    } else if (!a.balanceOf && b.balanceOf) {
      return 1;
    } else {
      return a.name.localeCompare(b.name);
    }
  });
}

export const openInNewTab = (href: string) => {
  window.open(href, "_blank", "noreferrer noopener");
};

export const openInSameTab = (href: string) => {
  window.location.href = href;
};

export const copyToClipboard = async (text?: string) => {
  try {
    const toCopy = text || "";
    await navigator.clipboard.writeText(toCopy);
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
};

export const generateUUID = (options?: V4Options) => {
  return v4(options);
};

export const formatRejectMetamaskErrorMessage = (err: any) => {
  return err?.code === USER_REJECTED_REQUEST_CODE ||
    err?.code === "ACTION_REJECTED"
    ? "Transaction not signed. If this was an error, please attempt to sign again."
    : err?.mesage;
};
