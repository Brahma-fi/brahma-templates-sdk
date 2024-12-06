import { keccak256, toHex } from "viem";

export function generateCalldata(
  functionSignature: string,
  args: (string | bigint)[]
): string {
  // Compute the function selector by taking the first 4 bytes of the keccak256 hash
  const functionSelector = keccak256(toHex(functionSignature)).slice(0, 8);

  const formattedArgs = args.map((arg) => {
    if (typeof arg === "string") {
      // Remove '0x' prefix and pad to 64 characters
      return arg.toLowerCase().replace(/^0x/, "").padStart(64, "0");
    } else if (typeof arg === "bigint") {
      // Convert bigint to hex string and pad to 64 characters
      return arg.toString(16).padStart(64, "0");
    }
    throw new Error("Unsupported argument type");
  });

  return `0x${functionSelector}${formattedArgs.join("")}`;
}
