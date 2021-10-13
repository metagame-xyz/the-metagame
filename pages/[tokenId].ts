import type { NextApiRequest, NextApiResponse } from 'next';
import { ioredisClient } from '../utils/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { tokenId } = req.query;
    const addressString: string = Array.isArray(tokenId) ? tokenId[0] : tokenId;
    // const addressString = '0x17A059B6B0C8af433032d554B0392995155452E6';
    const data = await ioredisClient.hgetall(addressString.toLowerCase());

    const metadata = JSON.parse(data.metadata);

    /**********/
    /* Canvas */
    /**********/
    const canvasDiameter = 1000;
    const canvasRadius = canvasDiameter / 2;
    const center = canvasRadius;
    const canvasPartSize = canvasRadius / 24;
    const canvasSvg = `<svg width="${canvasDiameter}" height="${canvasDiameter}" viewBox="0 0 ${canvasDiameter} ${canvasDiameter}" fill="none" xmlns="http://www.w3.org/2000/svg">`;
    const closingSvgTag = `</svg>`;

    /**************/
    /* Tree Trunk */
    /**************/
    const currentBlock = 13_411_560;
    // const blockAge = 11_000_000;
    const blockAge = metadata.attributes[9].value;
    const treeSvgArray = [];

    const maxRings = Math.floor(currentBlock / 10 ** 5);
    const rings = Math.floor(blockAge / 10 ** 5);
    // const rings = 40;
    const ringSize = canvasRadius / maxRings;
    console.log('ring size:', ringSize);
    const treeSize = ringSize * rings;

    // pick color
    const hue = Math.round((rings / maxRings) * 360); // 360 hues
    const hslString = (saturation: number) => `hsl(${hue}, ${saturation}%, 72%)`;

    // draw rings
    for (let i = rings; i > 0; i--) {
        const radius = i * ringSize;
        const saturation = Math.round((i / rings) * 100);
        const str = `<circle cx="${center}" cy="${center}" r="${radius}" stroke="hsl(${hue}, 48%, 24%)" stroke-width="1" fill="${hslString(
            saturation,
        )}"/>`;
        treeSvgArray.push(str);
    }
    const treeSvg = treeSvgArray.join('');

    /**************************************************/
    /* Time circles: Month, Day, Hour, Minute, Second */
    /**************************************************/
    const timeMetadata = metadata.attributes.slice(1, 6);
    const timeSvgArray = [];
    const year = metadata.attributes[0].value;
    const month = timeMetadata[0].value;

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

        return `<circle cx="${xCoord}" cy="${yCoord}" r="${radius}" stroke="hsl(${reverseHue}, 48%, 24%)" stroke-width="1" fill="hsl(${reverseHue}, 48%, ${l}%)"/>`;
    };

    timeMetadata.forEach(({ trait_type, value }) =>
        timeSvgArray.push(timeDataToSvg(trait_type, value)),
    );
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
    // writeFileSync(`./public/${addressString.substr(0, 8)}.svg`, svgString);

    const svgBuffer = Buffer.from(svgString, 'utf-8');
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(svgBuffer);
}
