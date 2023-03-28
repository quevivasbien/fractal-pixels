import Color from "./colors";

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

const DEFAULT_PALETTE = [
    Color.fromHex("#000000"),
    Color.fromHex("#0000FF"),
    Color.fromHex("#00FF00"),
    Color.fromHex("#00FFFF"),
    Color.fromHex("#FF0000"),
    Color.fromHex("#FF00FF"),
    Color.fromHex("#FFFF00"),
    Color.fromHex("#FFFFFF"),
];

export interface MandelProps {
    x0: number;
    y0: number;
    width: number;
    height: number;
    pixelSize: number;  // distance in complex plane per pixel
    maxIter: number;
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

    paint(palette: Color[] = DEFAULT_PALETTE): Color[][] {
        const cutoffs = palette.map((_, i) => (i + 1) * this.props.maxIter / palette.length);
        return this.grid.map(row => row.map(i => {
            let j = 0;
            while (i > cutoffs[j]) {
                j++;
            }
            return palette[j];
        }));
    }
}