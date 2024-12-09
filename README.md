# Brahma Templates SDK

The `brahma-templates-sdk` is a powerful tool designed to facilitate interaction with Brahma. It provides a set of functions to manage transactions efficiently.

## Installation

To install the SDK, use npm or yarn:

```sh
npm install brahma-templates-sdk
```

or

```sh
yarn add brahma-templates-sdk
```

### Main Functions

The `TemplatesSDK` class provides the following main functions:

1. **`getClientFactory()`**:

   - **Description**: Retrieves the user client factory details.
   - **Returns**: A `Promise` that resolves to a `UserClientFactory` object containing:
     - `eoa`: The externally owned account address.
     - `accountAddress`: The Brahma Account Address.
     - `chainId`: The chain ID.
     - `assets`: An array of [`TAsset`](/src/types.ts#L17) objects.

2. **`addToTxnBuilder(params, automationName)`**:
   - **Description**: Adds transactions to the transaction builder for a specified automation.
   - **Parameters**:
     - `params`: An object of type `BuilderParams` containing:
       - `transactions`: An array of `Transaction` objects, each with:
         - `toAddress`: The address to send the transaction to.
         - `callData`: The calldata for the transaction.
         - `value`: The value to send with the transaction.
     - `automationName`: A string representing the name of the automation.
   - **Returns**: A `Promise` that resolves to `void`.
   - **Throws**: An error if no transactions are passed.

## Example

Checkout the Drain-Account Example Template [here](/examples/template/)

Here's a basic example of how to use the SDK in a React component:

```ts
import React, { useState } from 'react';
import { TemplatesSDK } from 'brahma-templates-sdk';

const sdk = new TemplatesSDK();

export default function Template() {
  const [value, setValue] = useState(false);

  // Example usage of getClientFactory
  const fetchClientFactory = async () => {
    try {
      const clientFactory = await sdk.getClientFactory();
      console.log(clientFactory);
      // Example JSON response for assets
      /*
      {
        "eoa": "0xYourEOAAddress",
        "accountAddress": "0xConsoleAddress",
        "chainId": 1,
        "assets": [
          {
            "address": "0x0000000000000000000000000000000000000000",
            "balanceOf": {
              "decimals": 18,
              "formatted": "0.006461781144746279",
              "symbol": "ETH",
              "value": 6461781144746279n
            },
            "chainId": 81457,
            "core": true,
            "decimals": 18,
            "isActive": true,
            "isVerified": true,
            "logo": "https://brahma-static.s3.us-east-2.amazonaws.com/Asset/Asset%3DETH.svg",
            "name": "ETH",
            "prices": {
              "default": 3931.43
            },
            "symbol": "ETH",
            "updatedAt": "2024-02-28T20:44:00.526451Z",
            "value": "25.404040245889864072",
            "verified": true
          }
        ]
      }
      */
    } catch (error) {
      console.error("Error fetching client factory:", error);
    }
  };

  // Example usage of addToTxnBuilder
  const addTransaction = async () => {
    try {
      const params = {
        transactions: [
          {
            toAddress: "0x123...",
            callData: "0xabc...",
            value: BigInt(1000),
          },
          {
            toAddress: "0x456...",
            callData: "0xdef...",
            value: BigInt(2000),
          }
        ],
      };
      await sdk.builderCaller.addToTxnBuilder(params, "MyAutomation");
      // Example JSON params
      /*
      {
        "transactions": [
          {
            "toAddress": "0x123...",
            "callData": "0xabc...",
            "value": 1000
          },
          {
            "toAddress": "0x456...",
            "callData": "0xdef...",
            "value": 2000
          }
        ],
        "automationName": "MyAutomation"
      }
      */
    } catch (error) {
      console.error("Error adding to transaction builder:", error);
    }
  };

  return (
    <div>
      <button onClick={fetchClientFactory}>Fetch Client Factory</button>
      <button onClick={addTransaction}>Add Transaction</button>
    </div>
  );
}
```

## License

This project is licensed under the MIT License.
