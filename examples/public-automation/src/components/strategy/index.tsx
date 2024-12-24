import React, { useEffect, useMemo, useState } from 'react'
import { Address, erc20Abi, http, zeroAddress, createPublicClient } from 'viem'
import { useWalletClient } from 'wagmi'
import { wagmiConfig } from '@/wagmi'
import {
    sendTransaction,
    getBalance,
    waitForTransactionReceipt,
} from '@wagmi/core'
import useStore from './store'
import { Token } from './types'
import Header from './Header'
import SelectedTokens from './SelectedTokens'
import FeeInformation from './FeeInformation'
import DeploymentStatus from './DeploymentStatus'
import { SupportedChainIds, TAsset } from '@/types'
import useBoolean from '@/hooks/useBoolean'
import { formatRejectMetamaskErrorMessage, parseUnits } from '@/utils'
import usePolling from '@/hooks/usePolling'
import {
    ActionIconWrapper,
    Button,
    ContentWrapper,
    dispatchToast,
    FlexContainer,
    GrayBoundaryBlackWrapper,
    HrLine,
    InformationBar,
    SwapInput,
    Typography,
} from '../shared/components'
import { defaultTheme } from '@/lib'
import { AddIcon, CropFreeIcon, RefreshIcon, TickIcon } from '@/icons'
import assetsList from '@/arb.json'
import { TemplatesSDK } from 'brahma-templates-sdk-beta'

type StrategyPageProps = {
    eoa: Address
    chainId: SupportedChainIds
}

function StrategyPage({ eoa, chainId }: StrategyPageProps) {
    const { data: signer } = useWalletClient()

    const {
        eoaBalances: eoaAssets,
        balances: accountAssets,
        feeEstimate,
        deploymentStatus,
        preComputedConsoleAddress,
        fetchEoaAssets,
        fetchDeploymentStatus,
        generateAndDeploySubAccount,
        fetchPreComputedConsoleAddress,
        generateAndApproveSubAccount,
    } = useStore()

    const assets: TAsset[] = useMemo(() => {
        return assetsList.map((cAsset) => ({
            ...cAsset,
            chainId: cAsset.chainId as SupportedChainIds,
            address: cAsset.address as Address,
            verified: cAsset.isVerified,
            actions: [],
            value: '0',
            prices: { default: 0 },
        }))
    }, [assetsList])

    const [tokenIn, setTokenIn] = useState<Token>({
        amount: '',
        asset: null,
    })

    const [feeToken, setFeeToken] = useState<Token | null>({
        amount: '',
        asset: null,
    })

    const [selectedTokens, setSelectedTokens] = useState<Token[]>([])

    function updateTokenInValue(value: string) {
        setTokenIn((prev) => ({
            ...prev,
            amount: value,
        }))
    }

    function selectTokenInHandler(asset: TAsset) {
        setTokenIn({
            asset,
            amount: '',
        })
    }

    function addToSelectedTokens(token: Token) {
        setSelectedTokens((prev) => {
            const isTokenAlreadySelected = prev.some(
                (t) => t.asset?.address === token.asset?.address,
            )
            if (!isTokenAlreadySelected) {
                return [...prev, token]
            }
            return prev
        })
    }

    const { value: fundsDeposited, setValue: setFundsDeposited } =
        useBoolean(false)
    const { value: fundsDepositedLoading, setValue: setFundsDepositedLoading } =
        useBoolean(false)

    const {
        value: consoleDeployedLoading,
        setValue: setConsoleDeployedLoading,
    } = useBoolean(false)

    const isFeeGreaterThanDeposit = useMemo(() => {
        if (fundsDeposited || !feeEstimate || !feeToken) return false
        const feeTokenAmount =
            feeToken && feeEstimate && feeToken.amount
                ? parseUnits(feeToken.amount, feeToken?.asset?.decimals)
                : BigInt(0)
        const reducedAmount = feeTokenAmount - BigInt(feeEstimate)
        return reducedAmount < 0
    }, [fundsDeposited, feeEstimate, feeToken])

    async function precomputeAndSet() {
        setFundsDepositedLoading(false)
        const feeTokenAddress = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
        if (!signer) {
            dispatchToast({
                id: 'signer-error',
                title: 'Error',
                type: 'error',
                description: {
                    value: 'Wallet not connected',
                },
            })
            return
        }
        try {
            setFundsDepositedLoading(true)

            // Call the precompute function from the store
            await fetchPreComputedConsoleAddress(eoa, chainId, feeTokenAddress)
            const balance = await getBalance(wagmiConfig, {
                address: preComputedConsoleAddress as Address,
                blockTag: 'latest',
                chainId,
                unit: 'wei',
            })

            if (balance.value < BigInt(feeEstimate || 0)) {
                const tx = await sendTransaction(wagmiConfig, {
                    to: preComputedConsoleAddress,
                    value: BigInt(feeEstimate || 0),
                })

                console.log(tx, 'executed deposit')

                dispatchToast({
                    id: 'deposit-check',
                    title: 'deposit amount in console',
                    description: {
                        value: 'amount deposited successfully ',
                    },
                    type: 'success',
                })
            } else {
                dispatchToast({
                    id: 'deposit-check',
                    title: 'deposit amount in console',
                    description: {
                        value: 'amount deposited successfully ',
                    },
                    type: 'success',
                })
            }

            setFundsDeposited(true)
        } catch (error) {
            console.error('Error fetching precomputed address:', error)
            dispatchToast({
                id: 'precompute-error',
                title: 'Error',
                type: 'error',
                description: {
                    value: 'Failed to fetch precomputed console address',
                },
            })
        } finally {
            setFundsDepositedLoading(false)
        }
    }
    async function handleDepositFunds() {
        const feeTokenAddress = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'

        try {
            await generateAndApproveSubAccount(
                eoa,
                chainId,
                feeTokenAddress,
                feeEstimate as any,
                [],
                [],
            )
        } catch (err: any) {
            console.error('Error deploying Brahma Account:', err)
            dispatchToast({
                id: 'deploy-error',
                title: 'Error deploying Account',
                type: 'error',
                description: {
                    value: 'An error occurred during Brahma Account deployment',
                },
            })
        } finally {
        }
    }

    async function handleDeployConsole() {
        const feeTokenAddress = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'

        setConsoleDeployedLoading(true)
        try {
            await generateAndDeploySubAccount(
                eoa,
                chainId,
                feeTokenAddress,
                feeEstimate || '0',
                [],
                [],
            )
        } catch (err: any) {
            console.error('Error deploying Brahma Account:', err)
            dispatchToast({
                id: 'deploy-error',
                title: 'Error deploying Account',
                type: 'error',
                description: {
                    value: 'An error occurred during Brahma Account deployment',
                },
            })
        } finally {
            setConsoleDeployedLoading(false)
        }
    }

    function handleRefresh() {
        setSelectedTokens([])
        setFeeToken(null)
        setTokenIn({
            amount: '',
            asset: null,
        })
        setFundsDeposited(false)
    }

    useEffect(() => {
        function updateFeeToken() {
            if (!selectedTokens.length) return
            setFeeToken(selectedTokens[0])
        }

        updateFeeToken()
    }, [selectedTokens, tokenIn])

    usePolling(() => {
        fetchEoaAssets(eoa, assets)
    }, 3000)

    useEffect(() => {
        fetchEoaAssets(eoa, assets)
    }, [])

    usePolling(() => {
        if (!deploymentStatus || !deploymentStatus.taskId) return
        if (
            deploymentStatus.status === 'successful' ||
            deploymentStatus.status === 'failed' ||
            deploymentStatus.status === 'cancelled'
        )
            return
        fetchDeploymentStatus(deploymentStatus.taskId)
    }, 5000)

    const filteredEoaAssetsForCurrentChain = eoaAssets.data.filter(
        (asset) =>
            asset.chainId === chainId &&
            !selectedTokens.some(
                (token) =>
                    token.asset?.address.toLowerCase() ===
                    asset.address.toLowerCase(),
            ),
    )

    const getMaxTokenBalanceAvailable: bigint = tokenIn.asset
        ? tokenIn.asset.balanceOf?.value || BigInt(0)
        : BigInt(0)

    useEffect(() => {
        if (!signer?.account.address) return
        console.log('Signer changed', signer.account.address)
    }, [signer?.account.address])

    return (
        <FlexContainer>
            <FlexContainer
                justifyContent='space-between'
                flexDirection='column'
                alignItems='center'
                width={100}
                height={100}
            >
                <Header />

                <FlexContainer
                    justifyContent='space-between'
                    width={100}
                    padding='5rem 15rem'
                    height={100}
                >
                    <FlexContainer
                        style={{
                            flex: '0.7',
                        }}
                    >
                        <GrayBoundaryBlackWrapper
                            style={{
                                width: '100%',
                                height: '100%',
                                maxWidth: '85rem',
                            }}
                            padding='0.4rem'
                        >
                            <FlexContainer
                                bgColor={defaultTheme.colors.gray800}
                                width={100}
                                padding='1rem'
                                flexDirection='column'
                                gap={1}
                            >
                                <FlexContainer
                                    width={100}
                                    justifyContent='space-between'
                                    alignItems='center'
                                >
                                    <Typography type='TITLE_L'>
                                        Strategy
                                    </Typography>

                                    <ActionIconWrapper
                                        onClick={handleRefresh}
                                        size='M'
                                    >
                                        <RefreshIcon />
                                    </ActionIconWrapper>
                                </FlexContainer>

                                <HrLine />

                                <FlexContainer gap={1} alignItems='center'>
                                    <Typography type='BODY_MEDIUM_S'>
                                        Connected Wallet:
                                    </Typography>
                                    <Typography type='BODY_MEDIUM_S'>
                                        {eoa}
                                    </Typography>
                                </FlexContainer>

                                <HrLine />

                                {/* This is the template which will run in the iframe once Brahma account is deployed */}
                                <SelectedTokens
                                    feeToken={feeToken}
                                    selectedTokens={selectedTokens}
                                    updateFeeToken={setFeeToken}
                                />

                                <FeeInformation
                                    eoa={eoa}
                                    chainId={chainId}
                                    feeToken={feeToken}
                                    isFeeGreaterThanDeposit={
                                        isFeeGreaterThanDeposit
                                    }
                                    selectedTokens={selectedTokens}
                                    tokenIn={tokenIn}
                                    setFundsDeposited={setFundsDeposited}
                                />

                                {deploymentStatus &&
                                preComputedConsoleAddress ? (
                                    <DeploymentStatus />
                                ) : (
                                    fundsDeposited && (
                                        <InformationBar accent='success'>
                                            You have sufficient funds in the
                                            pre-computed account to cover the
                                            deployment fee. You can continue
                                            without depositing additional funds.
                                        </InformationBar>
                                    )
                                )}
                            </FlexContainer>
                        </GrayBoundaryBlackWrapper>
                    </FlexContainer>
                    <FlexContainer
                        style={{
                            flex: '0.3',
                        }}
                        flexDirection='column'
                        gap={1}
                    >
                        <FlexContainer width={100} gap={1.6}>
                            <FlexContainer
                                borderColor={defaultTheme.colors.gray700}
                                borderRadius={0.8}
                                padding='1.4rem'
                            >
                                {fundsDeposited ? (
                                    <TickIcon
                                        color={defaultTheme.colors.success}
                                        width={16}
                                        height={16}
                                    />
                                ) : (
                                    <CropFreeIcon />
                                )}
                            </FlexContainer>
                            <Button
                                onClick={precomputeAndSet}
                                buttonSize='L'
                                buttonType='primary'
                                disabled={fundsDepositedLoading}
                            >
                                <Typography type='BODY_MEDIUM_S'>
                                    {fundsDepositedLoading
                                        ? 'Checking Operator Status ...'
                                        : 'Precompute'}
                                </Typography>
                            </Button>
                        </FlexContainer>
                        <FlexContainer width={100} gap={1.6}>
                            <FlexContainer
                                borderColor={defaultTheme.colors.gray700}
                                borderRadius={0.8}
                                padding='1.4rem'
                            >
                                {fundsDeposited ? (
                                    <TickIcon
                                        color={defaultTheme.colors.success}
                                        width={16}
                                        height={16}
                                    />
                                ) : (
                                    <CropFreeIcon />
                                )}
                            </FlexContainer>
                            <Button
                                onClick={handleDepositFunds}
                                buttonSize='L'
                                buttonType='primary'
                                disabled={fundsDepositedLoading}
                            >
                                <Typography type='BODY_MEDIUM_S'>
                                    {fundsDepositedLoading
                                        ? 'Checking Operator Status ...'
                                        : 'Toggle Operator'}
                                </Typography>
                            </Button>
                        </FlexContainer>
                        <FlexContainer width={100} gap={1.6}>
                            <FlexContainer
                                borderColor={defaultTheme.colors.gray700}
                                borderRadius={0.8}
                                padding='1.4rem'
                            >
                                <CropFreeIcon />
                            </FlexContainer>
                            <Button
                                onClick={handleDeployConsole}
                                buttonSize='L'
                                buttonType='primary'
                                disabled={consoleDeployedLoading}
                            >
                                <Typography type='BODY_MEDIUM_S'>
                                    {consoleDeployedLoading
                                        ? 'Deploying ...'
                                        : 'Deploy Brahma Account'}
                                </Typography>
                            </Button>
                        </FlexContainer>
                    </FlexContainer>
                </FlexContainer>
            </FlexContainer>
        </FlexContainer>
    )
}

export default StrategyPage
