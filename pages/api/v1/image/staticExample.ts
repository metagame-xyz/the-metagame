import type { NextApiRequest, NextApiResponse } from 'next';
import { ioredisClient } from '../../../../utils/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // const { tokenId } = req.query;
    // const tokenIdString: string = Array.isArray(tokenId) ? tokenId[0] : tokenId;
    const addressString = '0x17A059B6B0C8af433032d554B0392995155452E6';
    const data = await ioredisClient.hgetall(addressString.toLowerCase());

    const metadata = JSON.parse(data.metadata);
    console.log(metadata.attributes);

    const canvasDiameter = 1000;
    const canvasRadius = canvasDiameter / 2;
    const canvasPartSize = canvasRadius / 24;
    const center = canvasDiameter / 2;
    const offsetThreeRadians = Math.PI / 2;

    let colors = ['#B7E4C7', '#95D5B2', '#74C69D', '#52B788', '#40916C', '#2D6A4F'];

    const year = metadata.attributes[0].value;
    const yearSVG = `<circle cx="${center}" cy="${center}" r="${center}" stroke="${colors[5]}" stroke-width="1" fill="${colors[0]}"/>`;

    const spacing = 1 / 6;
    const sizes = [spacing, 8, spacing, 6, spacing, 4, spacing, 3, spacing, 2, spacing];
    const reduce = (a: number, b: number) => a + b;

    const timeData = {
        month: {
            diameter: 8,
            max: 12,
            color: 1,
            space: sizes.slice(0, 1).reduce(reduce),
        },
        day: {
            diameter: 6,
            max: 30,
            color: 2,
            space: sizes.slice(0, 3).reduce(reduce),
        },
        hour: {
            diameter: 4,
            max: 24,
            color: 3,
            space: sizes.slice(0, 5).reduce(reduce),
        },
        minute: {
            diameter: 3,
            max: 60,
            color: 4,
            space: sizes.slice(0, 7).reduce(reduce),
        },
        second: {
            diameter: 2,
            max: 60,
            color: 5,
            space: sizes.slice(0, 9).reduce(reduce),
        },
    };

    const dataToSVGString = (measurement, val, colors) => {
        const radius = (timeData[measurement].diameter * canvasPartSize) / 2;
        const space = timeData[measurement].space * canvasPartSize;
        const radians = (val / timeData[measurement].max) * 2 * Math.PI;
        const totalRadians = radians - offsetThreeRadians;
        const cos = Number(Math.cos(totalRadians).toFixed(12));
        const sin = Number(Math.sin(totalRadians).toFixed(12));
        console.log('cos:', cos);
        console.log('sin:', sin);

        const xCoord = cos * (radius + space) + canvasDiameter / 2;
        const yCoord = sin * (radius + space) + canvasDiameter / 2;

        console.log('xCoord:', xCoord);
        console.log('yCoord:', yCoord);

        const svgString = `<circle cx="${xCoord}" cy="${yCoord}" r="${radius}" stroke="${
            colors[5]
        }" stroke-width="1" fill="${colors[timeData[measurement].color]}"/>`;
        return svgString;
    };

    let attributeSVgArray = [];
    for (let i = 1; i < 6; i++) {
        attributeSVgArray.push(
            dataToSVGString(
                metadata.attributes[i].trait_type,
                metadata.attributes[i].value,
                colors,
            ),
        );
    }
    const attributeSvgString = attributeSVgArray.join('');

    const monthSVG = dataToSVGString('month', 12, colors);
    const daySVG = dataToSVGString('day', 30, colors);
    const hourSVG = dataToSVGString('hour', 24, colors);
    const minuteSVG = dataToSVGString('minute', 60, colors);
    const secondSVG = dataToSVGString('second', 60, colors);

    let svgData = [];
    svgData.push(
        `<svg width="${canvasDiameter}" height="${canvasDiameter}" viewBox="0 0 ${canvasDiameter} ${canvasDiameter}" fill="none" xmlns="http://www.w3.org/2000/svg">
        
        <style>.text { fill: black; font-family: serif; font-size: 14px; }</style>`,
    );
    svgData.push(yearSVG);
    // svgData.push(attributeSvgString);
    svgData.push(monthSVG);
    svgData.push(daySVG);
    svgData.push(hourSVG);
    svgData.push(minuteSVG);
    svgData.push(secondSVG);
    svgData.push(`<circle cx="${center}" cy="${center}" r="${1}" fill="black"/></svg>`);
    const svgString = svgData.join('');
    // console.log(svgString);

    const svgBuffer = Buffer.from(svgString, 'utf-8');

    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(svgBuffer);
}
