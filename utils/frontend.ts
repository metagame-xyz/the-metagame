import { NETWORK } from '@utils/constants';

export function getTruncatedAddress(address: string): string {
    if (address && address.startsWith('0x')) {
        return address.substr(0, 4) + '...' + address.substr(address.length - 4);
    }
    return address;
}

export const etherscanNetworkString = NETWORK.toLowerCase() == 'ethereum' ? '' : `${NETWORK}.`;

export function getNetwork(chainId: number): string {
    switch (chainId) {
        case 1:
            return 'Mainnet';
        case 3:
            return 'Ropsten';
        case 4:
            return 'Rinkeby';
        case 5:
            return 'Goerli';
        case 42:
            return 'Kovan';
        default:
            return `unknown network ${chainId}`;
    }
}

export function debug(varObj: object): void {
    Object.keys(varObj).forEach((str) => {
        console.log(`${str}:`, varObj[str]);
    });
}

export const event = (action: string, params: Object) => {
    window.gtag('event', action, params);
};

export type EventParams = {
    network?: string;
    buttonLocation?: string;
    connectionType?: string;
    connectionName?: string;
};
