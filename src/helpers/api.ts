import axios from "axios";

export const routes = {
  // Automation Context Fetcher Routes
  fetchAutomationSubscriptions: "/automations/subscriptions/console",
  fetchAutomationLogs: "/kernel/logs",

  // Public Deployer Routes
  fetchPreComputeAddress: "/deployer/public-strategy/precompute",
  fetchDeployerSignature: "/deployer/public-strategy/signature",
  deployPublicStrategy: "/deployer/public-strategy/deploy",
  fetchTaskStatus: "/relayer/tasks/status",
};

export const axiosInstance = axios.create({
  baseURL: "https://gtw.dev.brahma.fi/v1/",
});
