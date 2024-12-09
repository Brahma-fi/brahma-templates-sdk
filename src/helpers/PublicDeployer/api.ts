import axios from "axios";

export const routes = {
  fetchPreComputeAddress: "/deployer/public-strategy/precompute",
  fetchDeployerSignature: "/deployer/public-strategy/signature",
  deployPublicStrategy: "/deployer/public-strategy/deploy",
  fetchTaskStatus: "/relayer/tasks/status",
};

export const axiosInstance = axios.create({
  baseURL: "https://gtw.dev.brahma.fi/v1/",
});
