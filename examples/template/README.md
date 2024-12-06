# Brahma Template

This project utilizes the `brahma-templates-sdk` to and interact with the Brahma account. Below are the steps to install and use the SDK.

## Installation

To install the SDK, use npm or yarn:

```sh
npm install brahma-templates-sdk
```

or

```sh
yarn add brahma-templates-sdk
```

## Testing the App

You can test this app on the following URL, which will run it as an iframe:

```txt
https://playground.dev.console.brahma.fi/account/{consoleAddress}/custom-template?templateUrl={yourLocalHostUrl}
```

Replace `{consoleAddress}` with your console address and `{yourLocalHostUrl}` with your local host URL.

### Main Functions

The `TemplatesSDK` class provides the following main functions:

1. **`getClientFactory()`**:

   - **Description**: Retrieves the user client factory details.
   - **Returns**: A `Promise` that resolves to a `UserClientFactory` object containing:
     - `eoa`: The externally owned account address.
     - `consoleAddress`: The console address.
     - `chainId`: The chain ID.
     - `assets`: An array of [`TAsset`](/packages/brahma-templates-sdk/src/types.ts#L17) objects.

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

Here's a basic example of how to use the SDK in a React component:

```ts
import React, { useState } from 'react';
import { TemplatesSDK } from 'brahma-templates-sdk';

const apiKey = "your-api-key";

const sdk = new TemplatesSDK(apiKey);

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
        "consoleAddress": "0xConsoleAddress",
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

For more detailed usage, refer to the code in `App.tsx` where the SDK is integrated into the application logic.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.
