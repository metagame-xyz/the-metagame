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
import Web3Modal from 'web3modal';

import { INFURA_ID, NETWORK } from '@utils/constants';
import { debug, getTruncatedAddress } from '@utils/frontend';

import rainbowLogo from '../images/rainbow.png';

export const ethersNetworkString = NETWORK == 'ethereum' ? 'homestead' : NETWORK;
export const web3ModalString = NETWORK == 'ethereum' ? 'mainnet' : NETWORK;

export const wrongNetworkToast = {
    title: 'Wrong Network.',
    description: `You must be on ${ethersNetworkString} to mint`,
    status: 'warning',
    position: 'top',
    duration: 4000,
    isClosable: true,
};

const defaultProvider = getDefaultProvider(ethersNetworkString, { infura: INFURA_ID });

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
            infuraId: INFURA_ID, // required
        },
        connector: async (ProviderPackage, options) => {
            const provider = new ProviderPackage(options);

            await provider.enable();

            return provider;
        },
    },
    walletconnect: {
        package: WalletConnectProvider,
        options: {
            infuraId: INFURA_ID, // required
        },
    },
};

//web3Var: ReactiveVar<Web3>
async function openWeb3ModalGenerator(
    setProvider,
    setSigner,
    setUserAddress,
    setEnsName,
    setUserName,
    setAvatarUrl,
    toast,
) {
    const web3Modal = new Web3Modal({
        network: web3ModalString, // optional
        cacheProvider: false, // optional TODO true or ternary
        providerOptions, // required
    });

    async function updateVariables(providerFromModal) {
        let provider: BaseProvider = defaultProvider;
        let signer: JsonRpcSigner = null;
        let userAddress: string = null;
        let ensName: string = null;
        let userName: string = null;
        let avatarUrl: string = null;

        try {
            const ethersProvider = new Web3Provider(providerFromModal);
            const network = await ethersProvider.getNetwork();

            // check if network is correct for the given env (prod vs dev)
            if (network.name !== ethersNetworkString) {
                toast(wrongNetworkToast);
                throw new Error('Wrong Network');
            }

            const accounts = await ethersProvider.listAccounts();
            debug({ accounts });

            // check if there is an account
            if (accounts.length) {
                provider = ethersProvider;
                signer = ethersProvider.getSigner();
                debug({ signer });
                userAddress = await signer.getAddress();
                console.log('accounts:', userAddress);
                ensName = await ethersProvider.lookupAddress(userAddress);
                if (ensName) {
                    const ensResolver = await ethersProvider.getResolver(ensName);
                    avatarUrl = await ensResolver.getText('avatar');
                    console.log('avatar:', avatarUrl);
                }

                userName = ensName || getTruncatedAddress(userAddress);
                console.log('userName:', userName);
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
        }
    }

    try {
        const providerFromModal = await web3Modal.connect();

        await updateVariables(providerFromModal);
        // Subscribe to accounts change
        providerFromModal.on('accountsChanged', async (accounts: string[]) => {
            console.log('accountsChanged');
            await updateVariables(providerFromModal);
        });

        // Subscribe to chainId change
        providerFromModal.on('chainChanged', async (chainId: number) => {
            debug({ chainId });
            await updateVariables(providerFromModal);
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
            updateVariables(providerFromModal);
        });
    } catch (error) {
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

    function setInitialProvider() {
        setProvider(defaultProvider);
    }

    const toast = useToast();

    useEffect(() => {
        setInitialProvider();
        setInitialized(true);
    }, []);

    const openWeb3Modal = async () =>
        await openWeb3ModalGenerator(
            setProvider,
            setSigner,
            setUserAddress,
            setEnsName,
            setUserName,
            setAvatarUrl,
            toast,
        );

    const variables = { provider, signer, userAddress, ensName, userName, avatarUrl };
    const functions = { openWeb3Modal, toast };

    const value = { ...variables, ...functions };

    return initialized ? <EthereumContext.Provider value={value} {...props} /> : null;
}

export const useEthereum = () => {
    return useContext(EthereumContext);
};

export default EthereumProvider;
