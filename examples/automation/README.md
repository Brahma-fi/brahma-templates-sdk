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

After installing the SDK, you can initialize the `TestSDK` class in your project:

```typescript
import { TestSDK } from "brahma-templates-sdk";

const testSdk = new TestSDK();
```

## SDK Functions

The `TestSDK` provides several functions for different use cases:

1. **getClientFactory()**:
   - Returns the `chainId`, connected Brahma account address, assets of the Brahma account, and connected EOA.

2. **addAutomation(params)**:
   - Adds a new automation with the specified parameters.

3. **fetchAutomationSubscriptions(account, chainId)**:
   - Returns the already running automations for the connected Brahma Account.

4. **fetchAutomationLogs(automationId)**:
   - Returns logs for the specified `automationId`.

5. **addToTxnBuilder(params, templateName)**:
   - Passes an array of transactions with calldata, to, and value to run the specific transaction.

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
```

For more detailed usage, refer to the code in `src/shared/strategy/index.tsx` where the SDK is integrated into the application logic.
