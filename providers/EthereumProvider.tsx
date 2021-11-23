import { useToast } from '@chakra-ui/react';
import {
    BaseProvider,
    getDefaultProvider,
    JsonRpcSigner,
    Web3Provider,
} from '@ethersproject/providers';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { Signer } from 'ethers';
import { createContext, useContext, useEffect, useState } from 'react';
import Web3Modal, { getProviderInfo } from 'web3modal';

import {
    ALCHEMY_PROJECT_ID,
    connect_button_clicked,
    INFURA_PROJECT_ID,
    NETWORK,
    networkStrings,
    wallet_provider_clicked,
    wallet_provider_connected,
} from '@utils/constants';
import { debug, event, EventParams, getTruncatedAddress } from '@utils/frontend';

import rainbowLogo from '../images/rainbow.png';

export const wrongNetworkToast = {
    title: 'Wrong Network.',
    description: `You must be on ${networkStrings.ethers} to mint`,
    status: 'warning',
    position: 'top',
    duration: 4000,
    isClosable: true,
};

const defaultProvider = getDefaultProvider(networkStrings.ethers, {
    infura: INFURA_PROJECT_ID,
    alchemy: ALCHEMY_PROJECT_ID,
});

const EthereumContext = createContext(undefined);

const providerOptions = {
    'custom-rainbow': {
        display: {
            logo: rainbowLogo.src,
            name: 'Rainbow',
            description: 'Connect using rainbow',
        },
        package: WalletConnectProvider,
        options: {
            infuraId: INFURA_PROJECT_ID, // required
        },
        connector: async (ProviderPackage, options) => {
            const provider = new ProviderPackage(options);
            event('Rainbow Connector Selected', { network: options.network });

            await provider.enable();

            return provider;
        },
    },
    walletconnect: {
        package: WalletConnectProvider,
        options: {
            infuraId: INFURA_PROJECT_ID, // required
        },
    },
};

const teal50 = 'rgba(230, 255, 250, 1)';
const teal100 = 'rgba(178, 245, 234, 1)';
const teal800 = 'rgba(35, 78, 82, 1)';
const teal800Opaque = 'rgba(35, 78, 82, 0.5)';
const teal900 = 'rgba(29, 64, 68, 1)';

async function openWeb3ModalGenerator(
    setProvider,
    setSigner,
    setUserAddress,
    setEnsName,
    setUserName,
    setAvatarUrl,
    setEventParams,
    toast,
    buttonLocation,
) {
    const web3Modal = new Web3Modal({
        network: networkStrings.web3Modal, // optional
        cacheProvider: false, // optional TODO true or ternary
        providerOptions, // required
        theme: {
            background: teal900,
            main: teal50,
            secondary: teal100,
            border: teal800Opaque,
            hover: teal800,
        },
    });

    async function updateVariables(providerFromModal, eventParams) {
        let provider: BaseProvider = defaultProvider;
        let signer: JsonRpcSigner = null;
        let userAddress: string = null;
        let ensName: string = null;
        let userName: string = null;
        let avatarUrl: string = null;

        try {
            const ethersProvider = new Web3Provider(providerFromModal);
            const network = await ethersProvider.getNetwork();
            eventParams.network = network.name;

            // check if network is correct for the given env (prod vs dev)
            if (network.name !== networkStrings.ethers) {
                toast(wrongNetworkToast);
                event('Wrong Network', eventParams);
                throw new Error('Wrong Network');
            }

            const accounts = await ethersProvider.listAccounts();

            // check if there is an account
            if (accounts.length) {
                provider = ethersProvider;
                signer = ethersProvider.getSigner();
                userAddress = await signer.getAddress();
                ensName = await ethersProvider.lookupAddress(userAddress);
                if (ensName) {
                    const ensResolver = await ethersProvider.getResolver(ensName);
                    avatarUrl = await ensResolver.getText('avatar');
                }

                userName = ensName || getTruncatedAddress(userAddress);
            }
        } catch (error) {
            console.log('UPDATE PROVIDER VARIABLES ERROR');
            console.log(error);

            // update variables either with the new provider or the default provider
        } finally {
            setProvider(provider);
            setSigner(signer);
            setUserAddress(userAddress);
            setEnsName(ensName);
            setUserName(userName);
            setAvatarUrl(avatarUrl);
            eventParams = { ...eventParams, hasEns: !!ensName, hasEnsAvatar: !!avatarUrl };
            setEventParams(eventParams);
            event(wallet_provider_connected, eventParams);
        }
    }

    try {
        let eventParams: EventParams = { buttonLocation, network: NETWORK };
        event(connect_button_clicked, eventParams);

        const providerFromModal = await web3Modal.connect();
        const { id: connectionType, name: connectionName } = getProviderInfo(providerFromModal);
        eventParams = { ...eventParams, connectionType, connectionName };
        event(wallet_provider_clicked, eventParams);

        await updateVariables(providerFromModal, eventParams);
        // Subscribe to accounts change
        providerFromModal.on('accountsChanged', async (accounts: string[]) => {
            console.log('accountsChanged');
            await updateVariables(providerFromModal, eventParams);
        });

        // Subscribe to chainId change
        providerFromModal.on('chainChanged', async (chainId: number) => {
            debug({ chainId });
            await updateVariables(providerFromModal, eventParams);
            // window.location.reload();
        });

        // Subscribe to provider connection
        providerFromModal.on('connect', (info: { chainId: number }) => {
            console.log('provider fromModal Connected');
            debug({ info });
        });

        // Subscribe to provider disconnection
        providerFromModal.on('disconnect', (error: { code: number; message: string }) => {
            console.log('provider fromModal disconnected');
            debug({ error });
            updateVariables(providerFromModal, eventParams);
        });
    } catch (error) {
        event('Web3Modal closed by user', { network: NETWORK, buttonLocation });
        // error seems to be undefined when the user rejects connecting to metamask
        console.log('WEB3 MODAL ERROR:', error);
    }
}

function EthereumProvider(props): JSX.Element {
    const [initialized, setInitialized] = useState(false);
    const [provider, setProvider] = useState<BaseProvider>();
    const [signer, setSigner] = useState<Signer>();
    const [userAddress, setUserAddress] = useState<string>();
    const [ensName, setEnsName] = useState<string>('');
    const [userName, setUserName] = useState<string>('');
    const [avatarUrl, setAvatarUrl] = useState<string>('');
    const [eventParams, setEventParams] = useState<EventParams>({});

    function setInitialProvider() {
        setProvider(defaultProvider);
    }

    const toast = useToast();

    useEffect(() => {
        setInitialProvider();
        setInitialized(true);
    }, []);

    const openWeb3Modal = async (buttonLocation: string) =>
        await openWeb3ModalGenerator(
            setProvider,
            setSigner,
            setUserAddress,
            setEnsName,
            setUserName,
            setAvatarUrl,
            setEventParams,
            toast,
            buttonLocation,
        );

    const variables = { provider, signer, userAddress, ensName, userName, avatarUrl, eventParams };
    const functions = { openWeb3Modal, toast };

    const value = { ...variables, ...functions };

    return initialized ? <EthereumContext.Provider value={value} {...props} /> : null;
}

export const useEthereum = () => {
    return useContext(EthereumContext);
};

export default EthereumProvider;
