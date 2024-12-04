import {
  parseUnits as parseUnitsViem,
  formatUnits as formatUnitsViem,
} from "viem";
import { v4 } from "uuid";

const USER_REJECTED_REQUEST_CODE = 4001;

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

export const formatRejectMetamaskErrorMessage = (err: any) => {
  return err?.code === USER_REJECTED_REQUEST_CODE ||
    err?.code === "ACTION_REJECTED"
    ? "Transaction not signed. If this was an error, please attempt to sign again."
    : err?.mesage;
};

export const generateUUID = () => {
  return v4();
};
