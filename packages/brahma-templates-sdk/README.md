# Brahma Templates SDK

The `brahma-templates-sdk` is a powerful tool designed to facilitate interaction with Brahma. It provides a set of functions to manage automations, fetch logs, and handle transactions efficiently.

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

The `TestSDK` class provides the following main functions:

1. **`getClientFactory()`**:
   - Returns the chain ID, connected Brahma account address, assets of the Brahma account, and connected EOA.

2. **`addAutomation(params)`**:
   - Adds a new automation with the specified parameters.

3. **`fetchAutomationSubscriptions(account, chainId)`**:
   - Returns the currently running automations for the connected Brahma account.

4. **`fetchAutomationLogs(automationId)`**:
   - Retrieves logs for the specified automation ID.

5. **`addToTxnBuilder(params, templateName)`**:
   - Passes an array of transactions with calldata, to, and value to execute a specific transaction.

## Example

Here's a basic example of how to use the SDK in a React component:

```ts
import React, { useState } from 'react';
import { TestSDK } from 'brahma-templates-sdk';

const testSdk = new TestSDK();

export default function Template() {
const [value, setValue] = useState(false);
// existing code...
}
```

For a more comprehensive example, please refer to our [example React repository](#).

## Contributing

Once you have tested your template, please make a pull request on the [Brahma Templates GitHub repository](https://github.com/brahma-templates).

## License

This project is licensed under the MIT License.
