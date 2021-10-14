const parts = 12;
const DEGREE = 360;
let points = [];
for (let i = 0; i < parts; i++) {
    console.log('spot ~~', i, '~~');
    const onePart = (DEGREE / parts) * i;
    const sin = (Number(Math.sin((onePart * Math.PI) / 180).toFixed(3)) + 1) * 1000;
    const cos = (Number(Math.cos((onePart * Math.PI) / 180).toFixed(3)) + 1) * 1000;

    const sinPoint = sin < 0 ? Math.ceil(sin) : Math.floor(sin);
    const cosPoint = cos < 0 ? Math.ceil(cos) : Math.floor(cos);
    const point = ''.concat(sinPoint, ', ', cosPoint);
    console.log('point:', point);
    points.push(point);
}

const dodecagramPoints = [];
let pointer = 0;
const jump = 5;
for (let i = 0; i < parts; i++) {
    dodecagramPoints.push(points[pointer]);
    pointer = (pointer + jump) % parts;
}

console.log(dodecagramPoints.join(' '));
