export function getTruncatedAddress(address: string): string {
    if (address && address.startsWith('0x')) {
        return address.substr(0, 4) + '...' + address.substr(address.length - 4);
    }
    return address;
}

export function debug(varObj: object): void {
    Object.keys(varObj).forEach((str) => {
        console.log(`${str}:`, varObj[str]);
    });
}

export const event = (action: string, params?: Object) => {
    window.gtag('event', action, params);
};

export type EventParams = {
    network?: string;
    buttonLocation?: string;
    connectionType?: string;
    connectionName?: string;
    errorReason?: string;
    errorMessage?: string;
};

//not exactly what I need but close
export const timestampToWeeksDaysHoursMinutesSeconds = (timestamp: number): string => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);

    const weeksStr = weeks > 0 ? `${weeks}w ` : '';
    const daysStr = days > 0 ? `${days}d ` : '';
    const hoursStr = hours > 0 ? `${hours}h ` : '';
    const minutesStr = minutes > 0 ? `${minutes}m ` : '';
    const secondsStr = seconds > 0 ? `${seconds}s ` : '';

    return `${weeksStr}${daysStr}${hoursStr}${minutesStr}${secondsStr}`;
}