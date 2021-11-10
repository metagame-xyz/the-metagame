import type { NextApiRequest, NextApiResponse } from 'next';

import { ioredisClient, Metadata, timestampToDate } from '@utils';
import { CONTRACT_BIRTHBLOCK } from '@utils/constants';

export function generateSVG(metadata: Metadata): string {
    const { blockAge, timestamp } = metadata;
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

    const maxRings = Math.floor(CONTRACT_BIRTHBLOCK / 10 ** 5);
    const rings = Math.floor(blockAge / 10 ** 5);
    const ringSize = canvasRadius / maxRings;
    const treeSize = ringSize * rings;

    // pick color
    const hue = Math.round((rings / maxRings) * 360); // 360 hues
    const reverseHue = Math.abs(hue - 180);

    const treeSvgArray = [];
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
            max: new Date(year, month, 0).getDate(), // it varies 28,29,30,31
            colorLightness: 72,
        },
        hour: {
            radiusBase: 1.5,
            max: 12,
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
    const { tokenId } = req.query;
    const tokenIdString: string = Array.isArray(tokenId) ? tokenId[0] : tokenId;
    const data = await ioredisClient.hget(tokenIdString.toLowerCase(), 'metadata');

    if (!data) {
        return res.status(404).send({ message: `Image for token id ${tokenId} not found.` });
    }

    const metadata = JSON.parse(data);
    const svgString = generateSVG(metadata);

    const svgBuffer = Buffer.from(svgString, 'utf-8');
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(svgBuffer);
}
