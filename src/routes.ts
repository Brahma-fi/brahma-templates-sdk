const routes = {
  // ********** Automation Context Fetcher *********** //
  generateCalldata: "/builder/generate", // done
  //   /subscribe
  //   /update
  //   /cancel
  fetchAutomationSubscriptions: "/automations/subscriptions/console",
  fetchAutomationLogs: "/kernel/logs",
  kernelTasks: "/kernel/tasks",
  kernelExecutor: "/kernel/executor",
  automationsExecutor: "/automations/executor",
  executorNonce: "/automations/executor/nonce",
  workflowStatus: "/kernel/tasks/status",
  // ********** Automation Context Fetcher *********** //

  // ********** Core Actions *********** //
  // generate.send
  // generate.swap
  // generate.bridge

  // swap
  swapRoutes: "/builder/swap/routes",
  // bridge
  fetchBridgingRoutes: "/builder/bridge/routes",
  fetchBridgingStatus: "/builder/bridge/status",

  fetchExistingAccounts: "/user/consoles",

  indexTransaction: "/indexer/process",

  // ********** Core Actions *********** //
};

export default routes;
