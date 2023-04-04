import Color, { getRandomPalette } from "./colors";

class Complex {
    real: number;
    imag: number;
    constructor(real: number, imag: number) {
        this.real = real;
        this.imag = imag;
    }

    add(c: Complex): Complex {
        return new Complex(this.real + c.real, this.imag + c.imag);
    }

    square(): Complex {
        return new Complex(this.real * this.real - this.imag * this.imag, 2 * this.real * this.imag);
    }

    abs(): number {
        return Math.sqrt(this.real * this.real + this.imag * this.imag);
    }
}

export interface MandelProps {
    x0: number;
    y0: number;
    width: number;
    height: number;
    pixelSize: number;  // distance in complex plane per pixel
    maxIter: number;
    palette: Color[];
}

export class Mandelbrot {
    props: MandelProps;
    grid: number[][];
    
    constructor(props: MandelProps) {
        this.props = props;
        this.grid = this.generate();
    }

    static iter(c: Complex, maxIter: number): number {
        let z = new Complex(0, 0);
        let i = 0;
        while (i < maxIter && z.abs() < 2) {
            z = z.square().add(c);
            i++;
        }
        return i;
    }

    private generate(): number[][] {
        const { x0, y0, width, height, pixelSize, maxIter } = this.props;
        let result = new Array(height);
        for (let i = 0; i < height; i++) {
            result[i] = new Array(width);
            for (let j = 0; j < width; j++) {
                let c = new Complex(x0 + j * pixelSize, y0 + i * pixelSize);
                result[i][j] = Mandelbrot.iter(c, maxIter);
            }
        }
        return result;
    }

    paint(scale: number = 0.1): Color[][] {
        const palette = this.props.palette;
        const cutoffs = palette.map((_, i) => (i + 1) * Math.pow(this.props.maxIter, scale) / palette.length);
        return this.grid.map(row => row.map(x => {
            const scaledX = Math.pow(x, scale);
            let j = 0;
            while (scaledX > cutoffs[j]) {
                j++;
            }
            return palette[j];
        }));
    }
}

class Scene {
    x0: number;
    y0: number;
    width: number;
    height: number;
    pixelSize: number;  // distance in complex plane per pixel

    constructor(x0: number, y0: number, width: number, height: number, realWidth: number) {
        this.x0 = x0;
        this.y0 = y0;
        this.width = width;
        this.height = height;
        this.pixelSize = realWidth / width;
    }
}

const SCENES: Record<string, Scene[]> = {
    'easy': [
        new Scene(-2, -1.5, 20, 20, 3),
        new Scene(0.15, 0, 20, 30, 0.5),
    ],
    'medium': [
        new Scene(-2, -1.5, 30, 30, 3),
        new Scene(-1, -1, 30, 30, 1),
    ],
    'hard': [
        new Scene(-2, -1.5, 40, 40, 3),
    ]
};


export function getRandomMandelProps(difficulty: string): MandelProps {
    const scenesList = SCENES[difficulty];
    const scene = scenesList[Math.floor(Math.random() * scenesList.length)];
    return {
        x0: scene.x0,
        y0: scene.y0,
        width: scene.width,
        height: scene.height,
        pixelSize: scene.pixelSize,
        maxIter: 100,
        palette: getRandomPalette(),
    }
}