export const getTruncatedAddress = (address) => {
    if (address && address.startsWith('0x')) {
        return address.substr(0, 4) + '...' + address.substr(address.length - 4);
    }
    return address;
};

export const getNetwork = (chainId) => {
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
};

export const debug = (varObj) => {
    const str = Object.keys(varObj)[0];
    console.log(`${str}:`, varObj[str]);
};
