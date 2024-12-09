# Brahma Template

This project utilizes the `brahma-templates-sdk` to manage automations and interact with the Brahma account. Below are the steps to install and use the SDK.

## Installation

To install the `brahma-templates-sdk`, run one of the following commands:

```bash
npm install brahma-templates-sdk
# or
yarn add brahma-templates-sdk
```

## Initialization

After installing the SDK, you can initialize the `Templates` class in your project:

```typescript
import React, { useState } from "react";
import { TemplatesSDK } from "brahma-templates-sdk";

const apiKey = "your-api-key";

const sdk = new TemplatesSDK(apiKey);
```

## Usage Example

Here's an example of how you might use the SDK in your project:

```typescript
async function fetchDetails() {
  try {
    const clientFactory = await testSdk.getClientFactory();
    console.log("Client factory response:", clientFactory);
    // Use the clientFactory data as needed
  } catch (error) {
    console.error("An error occurred while fetching details:", error);
  }
}

async function handleAddAutomation() {
  try {
    // Update token inputs
    const tokenInputs: Record<Address, string> = {};

    // Update token limits
    const tokenLimits: Record<Address, string> = {};

    await sdk.builderCaller.addAutomation({
      feeAmount: "0",
      feeToken: zeroAddress,
      metadata: {},
      registryId: HARDCODED_REGISTRY_ID,
      tokenInputs,
      tokenLimits,
    });
  } catch (error) {
    setShowIframePrompt(true);
    console.log("error", error);
  } finally {
    setLoading(false);
  }
}

async function fetchAutomations() {
  try {
    const automations =
      await sdk.automationContextFetcher.fetchAutomationSubscriptions(
        accountAddress,
        chainId
      );

    setAutomations(activeAutomations);
  } catch (error) {
    setShowIframePrompt(true);
    console.log("error", error);
    console.error("An error occurred while fetching assets:", error);
  }
}

async function fetchSelectedAutomationLogs() {
  try {
    const logs =
      (await sdk.automationContextFetcher.fetchAutomationLogs(
         automationId
      )) || [];

    setSelectedAutomationLogs(logs);
  } catch (error) {
    setShowIframePrompt(true);
    console.log("error", error);
  }
}
```

For more detailed usage, refer to the code in `src/shared/strategy/index.tsx` where the SDK is integrated into the application logic.
