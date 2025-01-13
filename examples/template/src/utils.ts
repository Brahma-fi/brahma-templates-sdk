import { concat, Hash, Hex, pad, toHex } from "viem";

// Utility function to pad a value to a specific byte length
function padToBytes(value: Hex, bytes: number): Hex {
  return pad(value, { size: bytes });
}

// Utility function to encode a transaction in the required format
function encodeTransaction(to: Hex, value: bigint, data: Hash): Hex {
  const operation = padToBytes("0x00", 1); // 1 byte for operation: 0 = call, 1 = delegatecall
  const toAddress = padToBytes(to, 20); // 20 bytes for the `to` address
  const valueEncoded = pad(toHex(value), { size: 32 }); // 32 bytes for value
  const dataLength = pad(toHex(BigInt(data.length)), { size: 32 }); // 32 bytes for data length
  const dataEncoded = data; // Encode data as hex

  console.log("-----------------");
  console.log({
    operation,
    toAddress,
    valueEncoded,
    dataLength,
    dataEncoded,
  });
  console.log("-----------------");

  // Concatenate all the parts to create the final transaction encoding
  return concat([operation, toAddress, valueEncoded, dataLength, dataEncoded]);
}

// Function to batch transactions
export function batchTxns(
  transactions: Array<{ toAddress: Hex; callData: Hash; value: bigint }>
): Hex {
  let encodedTransactions: Hex = "0x"; // Initialize the final batch as a hex string

  // Loop through each transaction and encode it
  for (const txn of transactions) {
    const encodedTxn = encodeTransaction(
      txn.toAddress,
      txn.value,
      txn.callData
    );
    encodedTransactions = concat([encodedTransactions, encodedTxn]);
  }

  console.log("encodedTransactions", encodedTransactions);

  return encodedTransactions; // Return the concatenated encoded transactions
}

function testBatch() {
  const transactions: Array<{
    toAddress: Hex;
    callData: Hash;
    value: bigint;
  }> = [
    {
      callData:
        "0x095ea7b3000000000000000000000000d870765964c1f2d5f45d9542881afa2afdfbd01a0000000000000000000000000000000000000000000000000000000000061a80",
      toAddress: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
      value: BigInt(0),
    },
    {
      callData:
        "0xa9059cbb000000000000000000000000d870765964c1f2d5f45d9542881afa2afdfbd01a0000000000000000000000000000000000000000000000000000000000061a80",
      toAddress: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
      value: BigInt(0),
    },
  ];

  batchTxns(transactions);
}

testBatch();

// const batchedTransactionCallData = batchTxns(updatedTransactions);

// console.log("batchedTransactionCallData", batchedTransactionCallData);

// const batchedTransactionData: TransactionParams = {
//   toAddress: tokenAddress as Address, // Contract Address
//   callData: batchedTransactionCallData, // Batched calldata
//   value: "0", // No ETH value is sent with the transaction
// };
