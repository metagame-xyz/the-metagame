import type { NextApiRequest, NextApiResponse } from 'next';

import { timestampToDate } from '@utils';
import { debug } from '@utils/frontend';

export function generateSVG(): string {
    const blockAge = 12900000;
    const timestamp = 1517378400;
    const dateObj = timestampToDate(timestamp);
    const { year, month } = dateObj;

    debug(dateObj);

    /**********/
    /* Canvas */
    /**********/
    const canvasDiameter = 100;
    const canvasRadius = canvasDiameter / 2;
    const center = canvasRadius;
    const canvasPartSize = canvasRadius / 24 / (34 / 134);
    const canvasSvg = `<svg width="${canvasDiameter}" height="${canvasDiameter}" viewBox="0 0 ${canvasDiameter} ${canvasDiameter}" fill="none" xmlns="http://www.w3.org/2000/svg">`;
    const closingSvgTag = `</svg>`;

    /**************/
    /* Tree Trunk */
    /**************/
    const currentBlock = 13_411_560;
    const treeSvgArray = [];

    const maxRings = Math.floor(currentBlock / 10 ** 5);
    const rings = Math.floor(blockAge / 10 ** 5);
    const ringSize = canvasRadius / maxRings;
    const treeSize = ringSize * rings;

    // draw ring
    const radius = rings * ringSize;
    const str = `<circle cx="${center}" cy="${center}" r="${radius}" stroke="black" stroke-width="3" fill=""/>`;
    treeSvgArray.push(str);
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

        const totalSpace = space - radius;

        const xCoord = cos * totalSpace + canvasDiameter / 2;
        const yCoord = sin * totalSpace + canvasDiameter / 2;

        return `<circle cx="${xCoord}" cy="${yCoord}" r="${radius}" stroke="black" stroke-width="3" fill=""/>`;
    };

    for (const val in dateObj) {
        if (val !== 'year') {
            timeSvgArray.push(timeDataToSvg(val, dateObj[val]));
        }
    }
    const timeSvg = timeSvgArray.join('');

    /**************/
    /* SVG concat */
    /**************/
    let svgData = [];
    svgData.push(canvasSvg);
    svgData.push(treeSvg);
    svgData.push(timeSvg);
    svgData.push(closingSvgTag);
    const svgString = svgData.join('');

    return svgString;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const svgString = generateSVG();

    const svgBuffer = Buffer.from(svgString, 'utf-8');
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(svgBuffer);
}
