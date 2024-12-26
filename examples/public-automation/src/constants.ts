import { Chain } from 'viem'

const swell = {
    id: 1923,
    name: 'Swell',
    // iconUrl: 'https://brahma-static.s3.us-east-2.amazonaws.com/Asset/Blast.svg',
    testnet: false,
    nativeCurrency: {
        decimals: 18,
        name: 'Ethereum',
        symbol: 'ETH',
    },
    rpcUrls: {
        public: {
            http: ['https://swell-mainnet.alt.technology'],
        },
        default: {
            http: ['https://swell-mainnet.alt.technology'],
        },
        appOnly: {
            http: ['https://swell-mainnet.alt.technology'],
        },
    },
    blockExplorers: {
        etherscan: {
            name: 'Swellscan',
            url: 'https://explorer.swellnetwork.io/',
        },
        default: {
            name: 'Swellscan',
            url: 'https://explorer.swellnetwork.io/',
        },
    },
    contracts: {
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 305649,
        },
    },
} as const satisfies Chain

export const SUPPORTED_CHAINS = [swell] as const satisfies Chain[]

export const SUPPORTED_CHAINS_IDS = SUPPORTED_CHAINS.map((chain) => chain.id)

export const ARBITRUM_CHAIN_ID = swell.id

export const USER_REJECTED_REQUEST_CODE = 4001

export const MULTICALL_CONTRACT_ADDRESS =
    '0xcA11bde05977b3631167028862bE2a173976CA11'

export const SCAM_TOKEN_WORDS = ['claim', 'visit', 'airdrop', 'rewards', 'http']


export const  OPERATOR_CONTRACT_ABI = [
  {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
  },
  {
      "inputs": [],
      "name": "InvalidDispute",
      "type": "error"
  },
  {
      "inputs": [],
      "name": "InvalidLengths",
      "type": "error"
  },
  {
      "inputs": [],
      "name": "InvalidProof",
      "type": "error"
  },
  {
      "inputs": [],
      "name": "InvalidUninitializedRoot",
      "type": "error"
  },
  {
      "inputs": [],
      "name": "NoDispute",
      "type": "error"
  },
  {
      "inputs": [],
      "name": "NotGovernor",
      "type": "error"
  },
  {
      "inputs": [],
      "name": "NotTrusted",
      "type": "error"
  },
  {
      "inputs": [],
      "name": "NotWhitelisted",
      "type": "error"
  },
  {
      "inputs": [],
      "name": "UnresolvedDispute",
      "type": "error"
  },
  {
      "inputs": [],
      "name": "ZeroAddress",
      "type": "error"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": false,
              "internalType": "address",
              "name": "previousAdmin",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "address",
              "name": "newAdmin",
              "type": "address"
          }
      ],
      "name": "AdminChanged",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "address",
              "name": "beacon",
              "type": "address"
          }
      ],
      "name": "BeaconUpgraded",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "address",
              "name": "user",
              "type": "address"
          },
          {
              "indexed": true,
              "internalType": "address",
              "name": "token",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
          }
      ],
      "name": "Claimed",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "_disputeAmount",
              "type": "uint256"
          }
      ],
      "name": "DisputeAmountUpdated",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": false,
              "internalType": "uint48",
              "name": "_disputePeriod",
              "type": "uint48"
          }
      ],
      "name": "DisputePeriodUpdated",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": false,
              "internalType": "bool",
              "name": "valid",
              "type": "bool"
          }
      ],
      "name": "DisputeResolved",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "address",
              "name": "_disputeToken",
              "type": "address"
          }
      ],
      "name": "DisputeTokenUpdated",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": false,
              "internalType": "string",
              "name": "reason",
              "type": "string"
          }
      ],
      "name": "Disputed",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": false,
              "internalType": "uint8",
              "name": "version",
              "type": "uint8"
          }
      ],
      "name": "Initialized",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "address",
              "name": "user",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "bool",
              "name": "isEnabled",
              "type": "bool"
          }
      ],
      "name": "OperatorClaimingToggled",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "address",
              "name": "user",
              "type": "address"
          },
          {
              "indexed": true,
              "internalType": "address",
              "name": "operator",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "bool",
              "name": "isWhitelisted",
              "type": "bool"
          }
      ],
      "name": "OperatorToggled",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "address",
              "name": "token",
              "type": "address"
          },
          {
              "indexed": true,
              "internalType": "address",
              "name": "to",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
          }
      ],
      "name": "Recovered",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [],
      "name": "Revoked",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": false,
              "internalType": "bytes32",
              "name": "merkleRoot",
              "type": "bytes32"
          },
          {
              "indexed": false,
              "internalType": "bytes32",
              "name": "ipfsHash",
              "type": "bytes32"
          },
          {
              "indexed": false,
              "internalType": "uint48",
              "name": "endOfDisputePeriod",
              "type": "uint48"
          }
      ],
      "name": "TreeUpdated",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "address",
              "name": "eoa",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "bool",
              "name": "trust",
              "type": "bool"
          }
      ],
      "name": "TrustedToggled",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "address",
              "name": "implementation",
              "type": "address"
          }
      ],
      "name": "Upgraded",
      "type": "event"
  },
  {
      "inputs": [],
      "name": "accessControlManager",
      "outputs": [
          {
              "internalType": "contract IAccessControlManager",
              "name": "",
              "type": "address"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "",
              "type": "address"
          }
      ],
      "name": "canUpdateMerkleRoot",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address[]",
              "name": "users",
              "type": "address[]"
          },
          {
              "internalType": "address[]",
              "name": "tokens",
              "type": "address[]"
          },
          {
              "internalType": "uint256[]",
              "name": "amounts",
              "type": "uint256[]"
          },
          {
              "internalType": "bytes32[][]",
              "name": "proofs",
              "type": "bytes32[][]"
          }
      ],
      "name": "claim",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "",
              "type": "address"
          },
          {
              "internalType": "address",
              "name": "",
              "type": "address"
          }
      ],
      "name": "claimed",
      "outputs": [
          {
              "internalType": "uint208",
              "name": "amount",
              "type": "uint208"
          },
          {
              "internalType": "uint48",
              "name": "timestamp",
              "type": "uint48"
          },
          {
              "internalType": "bytes32",
              "name": "merkleRoot",
              "type": "bytes32"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "disputeAmount",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "disputePeriod",
      "outputs": [
          {
              "internalType": "uint48",
              "name": "",
              "type": "uint48"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "disputeToken",
      "outputs": [
          {
              "internalType": "contract IERC20",
              "name": "",
              "type": "address"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "string",
              "name": "reason",
              "type": "string"
          }
      ],
      "name": "disputeTree",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "disputer",
      "outputs": [
          {
              "internalType": "address",
              "name": "",
              "type": "address"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "endOfDisputePeriod",
      "outputs": [
          {
              "internalType": "uint48",
              "name": "",
              "type": "uint48"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "getMerkleRoot",
      "outputs": [
          {
              "internalType": "bytes32",
              "name": "",
              "type": "bytes32"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "contract IAccessControlManager",
              "name": "_accessControlManager",
              "type": "address"
          }
      ],
      "name": "initialize",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "lastTree",
      "outputs": [
          {
              "internalType": "bytes32",
              "name": "merkleRoot",
              "type": "bytes32"
          },
          {
              "internalType": "bytes32",
              "name": "ipfsHash",
              "type": "bytes32"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "",
              "type": "address"
          }
      ],
      "name": "onlyOperatorCanClaim",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "",
              "type": "address"
          },
          {
              "internalType": "address",
              "name": "",
              "type": "address"
          }
      ],
      "name": "operators",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "proxiableUUID",
      "outputs": [
          {
              "internalType": "bytes32",
              "name": "",
              "type": "bytes32"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "tokenAddress",
              "type": "address"
          },
          {
              "internalType": "address",
              "name": "to",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "amountToRecover",
              "type": "uint256"
          }
      ],
      "name": "recoverERC20",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "bool",
              "name": "valid",
              "type": "bool"
          }
      ],
      "name": "resolveDispute",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "revokeTree",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "_disputeAmount",
              "type": "uint256"
          }
      ],
      "name": "setDisputeAmount",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "uint48",
              "name": "_disputePeriod",
              "type": "uint48"
          }
      ],
      "name": "setDisputePeriod",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "contract IERC20",
              "name": "_disputeToken",
              "type": "address"
          }
      ],
      "name": "setDisputeToken",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "user",
              "type": "address"
          }
      ],
      "name": "toggleOnlyOperatorCanClaim",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "user",
              "type": "address"
          },
          {
              "internalType": "address",
              "name": "operator",
              "type": "address"
          }
      ],
      "name": "toggleOperator",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "eoa",
              "type": "address"
          }
      ],
      "name": "toggleTrusted",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "tree",
      "outputs": [
          {
              "internalType": "bytes32",
              "name": "merkleRoot",
              "type": "bytes32"
          },
          {
              "internalType": "bytes32",
              "name": "ipfsHash",
              "type": "bytes32"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "components": [
                  {
                      "internalType": "bytes32",
                      "name": "merkleRoot",
                      "type": "bytes32"
                  },
                  {
                      "internalType": "bytes32",
                      "name": "ipfsHash",
                      "type": "bytes32"
                  }
              ],
              "internalType": "struct MerkleTree",
              "name": "_tree",
              "type": "tuple"
          }
      ],
      "name": "updateTree",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "newImplementation",
              "type": "address"
          }
      ],
      "name": "upgradeTo",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "newImplementation",
              "type": "address"
          },
          {
              "internalType": "bytes",
              "name": "data",
              "type": "bytes"
          }
      ],
      "name": "upgradeToAndCall",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
  }
];

export const OPERATOR_ADDRESS = '0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae'