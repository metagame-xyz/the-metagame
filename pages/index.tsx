import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import Birthblock from '../birthblock.json';
import { CONTRACT_ADDRESS } from '../utils/constants';
import { getTruncatedAddress, debug } from '../utils/frontend';
const FREE_MINTS = 144;
import { parseEther } from '@ethersproject/units';
import { useEthereum } from '../providers/EthereumProvider';
import { Contract } from '@ethersproject/contracts';
import { BigNumber } from '@ethersproject/bignumber';

function Home() {
    const { provider, signer, userAddress, ensName, openWeb3Modal } = useEthereum();

    const birthblockContract = new Contract(CONTRACT_ADDRESS, Birthblock.abi, provider);

    let [minted, setMinted] = useState(false);
    let [minting, setMinting] = useState(false);
    let [freeMintsLeft, setFreeMintsLeft] = useState<number>(null);

    // Mint Count
    useEffect(() => {
        console.log('subscribe effect');

        async function getMintedCount() {
            try {
                console.log('via load');
                const mintCount: BigNumber = await birthblockContract.MintedCount();
                setFreeMintsLeft(FREE_MINTS - mintCount.toNumber());
            } catch (error) {
                debug({ error });
            }

            // console.log('getMintedCount async finish');
        }
        getMintedCount();

        birthblockContract.on('Mint', (address: string, tokenId: BigNumber) => {
            console.log('via subscribe');

            debug({ address });
            debug({ tokenId });
            setFreeMintsLeft(FREE_MINTS - tokenId.toNumber());
        });
    }, []);

    const mint = async () => {
        setMinting(true);
        console.log('contract address:', CONTRACT_ADDRESS);
        const birthblockContractWritable = birthblockContract.connect(signer);
        try {
            const data = await birthblockContractWritable.mint({
                value: parseEther('0.01'),
            });
            const moreData = await data.wait();
            debug({ moreData });
            setMinting(false);
            setMinted(true);
        } catch (error) {
            setMinting(false);
            // no from specified
            console.log(error);
            console.log(error?.error?.message);
        }
    };

    const mintText = () => {
        if (!minting && !minted) {
            return 'Mint';
        } else if (minting) {
            return 'Minting...';
        } else if (minted) {
            return 'Minted';
        } else {
            return 'wtf';
        }
    };

    const mintsLeftText = () => {
        return `${freeMintsLeft}/144 Free Mints Left`;
    };

    const userName = ensName || getTruncatedAddress(userAddress);

    return (
        <Layout>
            <div className="container">
                <div className="connect-wallet-container">
                    <div
                        className="button walletconnect"
                        onClick={() => {
                            openWeb3Modal();
                        }}>
                        Web3Modal Button
                    </div>
                </div>
                <br />
                <div className="connect-wallet-container">
                    <div className="wallet-header">{mintsLeftText()}</div>
                    <div className="button walletconnect" onClick={() => mint()}>
                        {mintText()}
                    </div>
                </div>
                <br />
                <div className="connect-wallet-container">
                    <div className="row-title">
                        <div>user: {userName} </div>
                    </div>
                </div>
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
            width: 600px;
            height: 200px;
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
