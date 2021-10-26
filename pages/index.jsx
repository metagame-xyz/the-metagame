import { useEffect, useState, useRef } from 'react';
import { useWeb3React, Web3ReactProvider } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import WalletConnectProvider from '@walletconnect/web3-provider';
import rainbowLogo from '../images/rainbow.png';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { Web3Provider, getDefaultProvider } from '@ethersproject/providers';
// import useLocalStorage from '../hooks/useLocalStorage';
import { MetamaskIcon, WalletConnectIcon } from '../components/icons';
import { Layout } from '../components/Layout';
import Birthblock from '../birthblock.json';
import { CONTRACT_ADDRESS, NETWORK } from '../utils/constants';
import { getTruncatedAddress, getNetwork, debug } from '../utils/frontend';
const FREE_MINTS = 144;
import { parseEther } from '@ethersproject/units';
import { Contract } from 'ethers';
import Web3Modal from 'web3modal';
import Web3 from 'web3';
import { useWeb3, providerOptions } from '../utils/web3Context';

function Home() {
    const { web3, openWeb3Modal } = useWeb3();

    const [accounts, setAccounts] = useState();

    useEffect(() => {
        async function getAccounts() {
            const data = await web3.eth.getAccounts();
            console.log('accounts:', data);
            setAccounts(data);
        }
        getAccounts();
    }, []);

    // const birthblockContract = new Contract(CONTRACT_ADDRESS, Birthblock.abi, provider);

    let [hasMinted, setHasMinted] = useState(true);
    let [minted, setMinted] = useState(false);
    let [minting, setMinting] = useState(false);
    let [freeMintsLeft, setFreeMintsLeft] = useState('?');
    // console.log(web3React);

    // async function openWeb3Modal() {
    //     const web3Modal = new Web3Modal({
    //         network: NETWORK, // optional
    //         cacheProvider: false, // optional
    //         providerOptions, // required
    //     });

    //     const provider = await web3Modal.connect();

    //     const web3 = new Web3(provider);
    // }

    // useEffect(() => {
    //     // console.log('getMintedCount effect start');
    //     const getMintedCount = async () => {
    //         const data = await birthblockContract.MintedCount();
    //         // console.log('getMintedCount async finish');
    //         console.log(data?.toNumber());
    //         setFreeMintsLeft(FREE_MINTS - data.toNumber());
    //     };

    //     getMintedCount();
    //     // console.log('getMintedCount effect end');
    // }, [freeMintsLeft]);

    const claimToken = async () => {
        setMinting(true);
        console.log('contract address:', CONTRACT_ADDRESS);
        const birthblockContract = new Contract(
            CONTRACT_ADDRESS,
            Birthblock.abi,
            library.getSigner(),
        );
        try {
            const data = await birthblockContract.mint({
                value: parseEther('0.01'),
            });
            console.log(data);
            const moreData = await data.wait();
            console.log(moreData);
        } catch (error) {
            // console.log(error);
            console.log(error.error.message);
        }
        setMinting(false);
        setMinted(true);
    };

    const claimText = () => {
        if (!minting && !minted) {
            return 'Claim';
        } else if (minting) {
            return 'Claiming...';
        } else if (minted) {
            return 'Claimed';
        } else {
            return 'wtf';
        }
    };

    const mintsLeftText = () => {
        return `${freeMintsLeft}/144 Free Mints Left`;
    };

    return (
        <Layout>
            <div className="container">
                <div className="connect-wallet-container">
                    <div className="connect-wallet-card">
                        <div className="wallet-header">{mintsLeftText()}</div>
                        <div
                            className="button walletconnect"
                            onClick={() => {
                                openWeb3Modal();
                            }}>
                            Web3Modal Button
                        </div>
                    </div>
                </div>
                <br />

                <style jsx>{`
          .container {
            min-height: 100vh;
            /* padding: 0 0.5rem; */
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            /* height: 100vh; */
            background-color: #fafafa;
          }
          .connect-wallet-container {
            display: flex;
            width: 400px;
            height: 300px;
            border-radius: 30px;
            background: #ffffff;
            justify-content: center;
            align-items: center;
            text-align: center;
            box-shadow: rgb(0 0 0 / 10%) 0px 4px 20px;
          }
          .wallet-header {
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 30px;
          }
          .button {
            width: 300px;
            height: 60px;
            background: #ffffff;
            box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 25px;
            margin: 20px auto;
          }
          .button:hover {
            cursor: pointer;
          }

          .connected-container {
            display: flex;
            /* margin: 20px auto; */
            width: 400px;
            border-radius: 30px;
            background: #ffffff;
            box-shadow: rgb(0 0 0 / 10%) 0px 4px 20px;
          }

          .row {
            display: flex;
            flex-direction: column;
            height: 80px;
            width: 400px;
            justify-content: center;
            padding: 0 20px;
          }

          .row-title {
            font-size: 16px;
            color: #afafaf;
            font-weight: 900;
          }
          .row-subtitle {
            font-size: 22px;
            font-weight: 700;
          }
          .disconnect-button {
            align-items: center;
            color: #f96666;
            font-size: 20px;
            font-weight: 900;
          }
          .disconnect-button:hover {
            cursor: pointer;
          }

          .divider {
            height: 0.1px;
            background-color: #e5e5e5;
            border: none;
            margin: unset;
          }

          .github {
            position: fixed;
            bottom: 30px;
          }

          @media screen and (max-width: 400px) {
            .connect-wallet-container {
              width: 80%;    
            }

            .button {
              width: 240px;
            }

            .connected-container, .row  {
              width: 300px;
            }
        `}</style>
            </div>
        </Layout>
    );
}

export default Home;
