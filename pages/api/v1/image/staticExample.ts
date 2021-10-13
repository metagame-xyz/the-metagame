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
    const center = canvasRadius;
    const canvasPartSize = canvasRadius / 24;
    const offsetThreeRadians = Math.PI / 2;

    let greenColors = ['#B7E4C7', '#95D5B2', '#74C69D', '#52B788', '#40916C', '#2D6A4F'];
    let redColors = ['#FFB3C1', '#FF8FA3', '#FF758F', '#FF4D6D', '#C9184A', '#A4133C'];

    const yearsData = {
        2015: { size: canvasRadius * 1.4, colors: greenColors },
        2016: { size: canvasRadius * 1.2, colors: redColors },
        2017: { size: canvasRadius * 1.0, colors: greenColors },
        2018: { size: canvasRadius * 0.8, colors: greenColors },
        2019: { size: canvasRadius * 0.6, colors: greenColors },
        2020: { size: canvasRadius * 0.4, colors: greenColors },
        2021: { size: canvasRadius * 0.2, colors: greenColors },
    };

    const currentBlock = 13_411_560;
    const blockAge = metadata.attributes[9].value;
    const maxRings = Math.floor(currentBlock / 10 ** 5);
    const rings = Math.floor(blockAge / 10 ** 5);
    const ringSize = canvasRadius / maxRings;
    const treeSize = ringSize * rings;


    const treeTrunk = () => {
        const treeSVGArr = [];
        for (let i = rings; i > 0; i--) {
            const radius = i * ringSize;
            const str = `<circle cx="${center}" cy="${center}" r="${radius}" stroke="${yearsData[2016].colors[5]}" stroke-width="1" fill="${yearsData[2016].colors[0]}"/>`;
            treeSVGArr.push(str);
        }

        return treeSVGArr.join('');
    };

    const treeStr = treeTrunk();

    const year = metadata.attributes[0].value;
    const yearSVG = `<circle cx="${center}" cy="${center}" r="${yearsData[2016].size}" stroke="${yearsData[2016].colors[5]}" stroke-width="1" fill="${yearsData[2016].colors[0]}"/>`;

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
        // console.log('cos:', cos);
        // console.log('sin:', sin);

        const xCoord = cos * (radius + space) + canvasDiameter / 2;
        const yCoord = sin * (radius + space) + canvasDiameter / 2;

        // console.log('xCoord:', xCoord);
        // console.log('yCoord:', yCoord);

        const svgString = `<circle cx="${xCoord}" cy="${yCoord}" r="${radius}" stroke="${
            colors[5]
        }" stroke-width="1" fill="${colors[timeData[measurement].color]}"/>`;
        return svgString;
    };

    let attributeSVgArray = [];
    const colors = yearsData[2016].colors;
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
        
        <style>.text { fill: black; font-family: serif; font-size: 50px; }</style>`,
    );
    svgData.push(treeStr);
    // svgData.push(yearSVG);
    // svgData.push(attributeSvgString);
    // svgData.push(monthSVG);
    // svgData.push(daySVG);
    // svgData.push(hourSVG);
    // svgData.push(minuteSVG);
    // svgData.push(secondSVG);
    svgData.push(
        `<circle cx="${center}" cy="${center}" r="${1}" fill="black"/></svg>`,
    );
    const svgString = svgData.join('');
    // console.log(svgString);

    const svgBuffer = Buffer.from(svgString, 'utf-8');

    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(svgBuffer);
}

// <text x="${800}" y="${950}" class="text">${
//     metadata.attributes[9].value
// }</text>