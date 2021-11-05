import type { NextApiRequest, NextApiResponse } from 'next';

import { Metadata, timestampToDate } from '@utils';

export function generateSVG(metadata: Metadata): string {
    // const { blockAge, timestamp } = metadata;
    const blockAge = 300000;
    const timestamp = 1600006000;
    const dateObj = timestampToDate(timestamp);
    const { year, month } = dateObj;

    /**********/
    /* Canvas */
    /**********/
    const canvasDiameter = 1000;
    const canvasRadius = canvasDiameter / 2;
    const center = canvasRadius;
    const canvasPartSize = canvasRadius / 24;
    const canvasSvg = `<svg width="${canvasDiameter}" height="${canvasDiameter}" viewBox="0 0 ${canvasDiameter} ${canvasDiameter}" fill="none" xmlns="http://www.w3.org/2000/svg">`;
    const defsOpenTag = '<defs>';
    const defsCloseTag = '</defs>';
    const closingSvgTag = `</svg>`;

    /**************/
    /* Tree Trunk */
    /**************/
    const currentBlock = 13_411_560;
    // const blockAge = 11_000_000;
    const treeSvgArray = [];

    const maxRings = Math.floor(currentBlock / 10 ** 5);
    const rings = Math.floor(blockAge / 10 ** 5);
    // const rings = 40;
    const ringSize = canvasRadius / maxRings;
    // console.log('ring size:', ringSize);
    const treeSize = ringSize * rings;

    // pick color
    const hue = Math.round((rings / maxRings) * 360); // 360 hues
    const hslString = (saturation: number) => `hsl(${hue}, ${saturation}%, 72%)`;

    // draw rings
    for (let i = rings; i > 0; i--) {
        const radius = i * ringSize;
        const saturation = Math.round((i / rings) * 100);
        const str = `<circle cx="${center}" cy="${center}" r="${radius}" stroke="hsl(${hue}, 48%, 24%)" stroke-width="1" fill="hsl(${hue}, ${saturation}%, 72%)" />`;
        treeSvgArray.push(str);
    }
    const treeSvg = treeSvgArray.join('');

    /**************************************************/
    /* Time circles: Month, Day, Hour, Minute, Second */
    /**************************************************/
    const timeSvgArray = [];

    const timeData = {
        month: {
            radiusBase: 3,
            max: 12,
            colorLightness: 84,
        },
        day: {
            radiusBase: 2,
            max: new Date(year, month, 0).getDate(), // it varies
            colorLightness: 72,
        },
        hour: {
            radiusBase: 1.5,
            max: 24,
            colorLightness: 60,
        },
        minute: {
            radiusBase: 1,
            max: 60,
            colorLightness: 48,
        },
        second: {
            radiusBase: 0.5,
            max: 60,
            colorLightness: 32,
        },
    };

    // flip is how many rings are needed to be able to flip the time circles comfortably into the tree
    const flip = (timeData['month'].radiusBase * 2 * canvasPartSize) / ringSize;

    /**************/
    /*  Gradient  */
    /**************/
    const timeGradientArr = [];

    // function to place a time circle in it's appropriate place around the clock / tree
    const timeDataToSvg = (measurement: string, val: number) => {
        const { radiusBase, max, colorLightness: l } = timeData[measurement];
        const radius = radiusBase * canvasPartSize;
        const space = treeSize;
        const radians = (val / max) * 2 * Math.PI;
        const offsetThreeRadians = Math.PI / 2;
        const totalRadians = radians - offsetThreeRadians;

        const cos = Number(Math.cos(totalRadians).toFixed(12));
        const sin = Number(Math.sin(totalRadians).toFixed(12));

        const totalSpace = rings > flip ? space - radius : space + radius;

        const xCoord = cos * totalSpace + canvasDiameter / 2;
        const yCoord = sin * totalSpace + canvasDiameter / 2;

        const reverseHue = Math.abs(hue - 180);

        timeGradientArr.push(`<radialGradient id="${measurement}">`);
        timeGradientArr.push(`<stop offset="0%" stop-color="hsl(${reverseHue}, 48%, ${l}%)"/>`);
        timeGradientArr.push(
            `<stop offset="100%" stop-color="hsl(${reverseHue + 120}, 48%, ${l}%)"/>`,
        );

        timeGradientArr.push(`</radialGradient>`);

        return `<circle cx="${xCoord}" cy="${yCoord}" r="${radius}" fill="url(#${measurement})"/>`;
    };

    for (const val in dateObj) {
        if (val !== 'year') {
            timeSvgArray.push(timeDataToSvg(val, dateObj[val]));
        }
    }
    const timeSvg = timeSvgArray.join('');

    const timeGradientSVG = timeGradientArr.join('');
    /**************/
    /* SVG concat */
    /**************/
    let svgData = [];
    svgData.push(canvasSvg);
    svgData.push(defsOpenTag);
    svgData.push(timeGradientSVG);
    svgData.push(defsCloseTag);
    svgData.push(treeSvg);
    svgData.push(timeSvg);
    svgData.push(closingSvgTag);
    const svgString = svgData.join('');

    return svgString;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const metadata: Metadata = {
        name: "0x2e0e's Birthblock: 11,540,159 ",
        description: 'A 2020 Sagittarius address born at 10:16 pm',
        image: 'https://birthblock.loca.lt/api/v1/image/1',
        external_url: 'https://birthblock.loca.lt/birthblock/1',
        address: '0x2e0e3F06289627A0C26Fe84178fbB10adD0e7C4C',
        parent: '0x4ade29fd887a0795db5ba72940a0803d15c4c3f0',
        firstRecieved: 'ether',
        treeRings: '18',
        timestamp: 1517378400,
        birthblock: '11,540,159',
        txnHash: '0xdc491d8018ccc49641f97f577433b444090531becb525b4f95db6d7be04e444c',
        zodiacSign: 'Sagittarius',
        blockAge: 1200000,
        treeRingsLevel: 18,
    };

    const svgString = generateSVG(metadata);

    // writeFileSync(`./public/${addressString.substr(0, 8)}.svg`, svgString);

    const svgBuffer = Buffer.from(svgString, 'utf-8');
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(svgBuffer);
}
