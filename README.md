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

## Overview

The SDK is structured into three main components, each handling specific functionalities:

### 1. Automation Context Fetcher

Responsible for fetching automation logs and subscriptions. Utilizes HTTP GET requests to interact with the Brahma backend.

#### Automation Context Fetcher Functions

- **`fetchAutomationLogs(automationId: string): Promise<AutomationLogResponse[]>`**
  - **Description**: Fetches logs for a specific automation.
  - **Parameters**:
    - `automationId`: A string representing the unique ID of the automation.
  - **Returns**: A `Promise` that resolves to an array of `AutomationLogResponse` objects.

- **`fetchAutomationSubscriptions(accountAddress: Address, chainId: number): Promise<AutomationSubscription[]>`**
  - **Description**: Retrieves subscriptions for a given account and chain ID.
  - **Parameters**:
    - `accountAddress`: The address of the account (`Address` type).
    - `chainId`: The blockchain network ID (`number` type).
  - **Returns**: A `Promise` that resolves to an array of `AutomationSubscription` objects.

### 2. Builder Caller

Manages transaction building and automation operations. Communicates with a parent iFrame using a `Communicator` interface.

#### Builder Caller Functions

- **`addToTxnBuilder(params: BuilderParams, automationName: string): Promise<void>`**
  - **Description**: Adds transactions to the transaction builder for a specified automation.
  - **Parameters**:
    - `params`: An object of type `BuilderParams` containing:
      - `transactions`: An array of `Transaction` objects, each with:
        - `toAddress`: The address to send the transaction to.
        - `callData`: The calldata for the transaction.
        - `value`: The value to send with the transaction.
    - `automationName`: A string representing the name of the automation.
  - **Returns**: A `Promise` that resolves to `void`.

- **`addAutomation(params: AddAutomationParams): Promise<void>`**
  - **Description**: Adds a new automation with specified parameters.
  - **Parameters**:
    - `params`: An object of type `AddAutomationParams`.
  - **Returns**: A `Promise` that resolves to `void`.

- **`cancelAutomation(params: CancelAutomationParams): Promise<void>`**
  - **Description**: Cancels an existing automation.
  - **Parameters**:
    - `params`: An object of type `CancelAutomationParams`.
  - **Returns**: A `Promise` that resolves to `void`.

### 3. Public Deployer

Handles the deployment of new Brahma Accounts and related operations. Makes HTTP POST requests to deploy accounts and manage user strategies.

#### Public Deployer Functions

- **`fetchPreComputeAddress(owner: Address, chainId: number, feeToken: Address): Promise<PreComputedAddressData | null>`**
  - **Description**: Fetches precomputed address data for a given owner, chain ID, and fee token.
  - **Parameters**:
    - `owner`: The address of the owner (`Address` type).
    - `chainId`: The blockchain network ID (`number` type).
    - `feeToken`: The address of the fee token (`Address` type).
  - **Returns**: A `Promise` that resolves to `PreComputedAddressData` or `null`.

- **`generateAutomationSubAccount(owner: Address, precomputedConsoleAddress: Address, chainID: number, registryID: string, feeToken: Address, feeEstimate: string, tokens: Address[], amounts: string[], automationSubscriptionLimits: AutomationSubscriptionLimits): Promise<TransferCalldataResponse | null>`**
  - **Description**: Generates an automation sub-account for a given set of parameters.
  - **Parameters**: Various parameters including owner address, precomputed console address, chain ID, registry ID, fee token, fee estimate, tokens, amounts, and subscription limits.
  - **Returns**: A `Promise` that resolves to `TransferCalldataResponse` or `null`.

- **`deployBrahmaAccount(owner: Address, chainID: number, registryID: string, subscriptionDraftID: string, subAccountPolicyCommit: string, feeToken: Address, tokens: Address[], amounts: string[], subAccountChainerSignature: string, feeEstimateSignature: string, feeEstimate: string, metadata: Record<string, unknown>): Promise<{ taskId: string } | null>`**
  - **Description**: Deploys an account and sub-account with the given parameters.
  - **Parameters**: Various parameters including owner address, chain ID, registry ID, subscription draft ID, sub-account policy commit, fee token, tokens, amounts, sub-account chainer signature, fee estimate signature, fee estimate, and metadata.
  - **Returns**: A `Promise` that resolves to an object containing `taskId` or `null`.

- **`fetchDeploymentStatus(taskId: string): Promise<TaskStatusData>`**
  - **Description**: Fetches the status of a task by its ID.
  - **Parameters**:
    - `taskId`: The ID of the task (`string` type).
  - **Returns**: A `Promise` that resolves to `TaskStatusData`.

## Example

Checkout the Drain-Account Example Template [here](/examples/template/)

Here's a basic example of how to use the SDK in a React component:

```ts
import React, { useState } from 'react';
import { TemplatesSDK } from 'brahma-templates-sdk';

const sdk = new TemplatesSDK('your-api-key');

export default function Template() {
  const [value, setValue] = useState(false);

  // Example usage of getClientFactory
  const fetchClientFactory = async () => {
    try {
      const clientFactory = await sdk.getClientFactory();
      console.log(clientFactory);
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
