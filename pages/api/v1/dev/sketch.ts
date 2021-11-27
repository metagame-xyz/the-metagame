import fs from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';
import p5 from 'p5js-node';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let p5Instance = new p5(sketch);

    function sketch(p: p5): void {
        p.setup = function () {
            p.createCanvas(200, 500);
        };

        p.draw = function () {
            p.background(0);
            p.fill(255);
            p.rect(10, 10, 50, 50);
            p.text('Hello World', 10, 10);
            console.log('Hello World');
        };
    }
    const buffer = p5Instance.canvas.toBuffer();
    res.setHeader('Content-Type', 'image/png');
    // fs.writeFileSync('test.png', buffer);
    res.send(buffer);
    // res.send({ message: 'hello world!' });
}
